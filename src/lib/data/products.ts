import { sanityClient } from '@/sanity/lib/client';
import { db } from '@/lib/db/db'; 
import { PRODUCT_QUERY } from '@/sanity/lib/queries';
import { eq, inArray, sql as drizzleSql, and, gte } from 'drizzle-orm';
import { productInventory } from '@/lib/db/schema/inventory';

export interface ProductWithInventory {
  // Sanity data
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
  description: string;
  price: number;
  compareAtPrice?: number;
  images: any[];
  category?: any;
  subcategory?: any;
  tags?: string[];
  specifications?: Array<{ key: string; value: string }>;
  status?: string;
  featured?: boolean;
  // Neon data
  inventory?: {
    stock_quantity: number;
    reserved_quantity: number;
    available_quantity: number;
    sku: string | null;
    reorder_level: number;
    cost_price: number | null;
  };
}

export interface InventoryUpdateData {
  stock_quantity?: number;
  reserved_quantity?: number;
  reorder_level?: number;
  cost_price?: number;
  sku?: string;
}

export class ProductService {
  // Get products with inventory data
  static async getProductsWithInventory(filters?: {
    category?: string;
    featured?: boolean;
    inStock?: boolean;
    limit?: number;
  }): Promise<ProductWithInventory[]> {
    try {
      // Build Sanity query with filters
      let query = PRODUCT_QUERY;
      
      if (filters?.category) {
        query = query.replace('[_type == "product"', `[_type == "product" && category->slug.current == "${filters.category}"`);
      }
      
      if (filters?.featured) {
        query = query.replace('[_type == "product"', '[_type == "product" && featured == true');
      }
      
      // Get products from Sanity
      const sanityProducts = await sanityClient.fetch(query);
      
      if (sanityProducts.length === 0) {
        return [];
      }
      
      // Get inventory data using Drizzle ORM
      const productIds = sanityProducts.map((p: any) => p._id);
      
      let inventoryQuery = db
        .select({
          sanity_product_id: productInventory.sanity_product_id,
          stock_quantity: productInventory.stock_quantity,
          reserved_quantity: productInventory.reserved_quantity,
          sku: productInventory.sku,
          reorder_level: productInventory.reorder_level,
          cost_price: productInventory.cost_price,
        })
        .from(productInventory)
        .where(inArray(productInventory.sanity_product_id, productIds));
      
      // Apply in-stock filter if needed
      if (filters?.inStock) {
        inventoryQuery = inventoryQuery.where(
          gte(drizzleSql`${productInventory.stock_quantity} - ${productInventory.reserved_quantity}`, 0)
        );
      }
      
      const inventoryData = await inventoryQuery;
      
      // Merge data
      let mergedProducts = sanityProducts.map((product: any) => {
        const inventory = inventoryData.find(
          (inv) => inv.sanity_product_id === product._id
        );
        
        const stockQuantity = inventory?.stock_quantity ?? 0;
        const reservedQuantity = inventory?.reserved_quantity ?? 0;
        const availableQuantity = Math.max(0, stockQuantity - reservedQuantity);
        
        return {
          ...product,
          inventory: {
            stock_quantity: stockQuantity,
            reserved_quantity: reservedQuantity,
            available_quantity: availableQuantity,
            sku: inventory?.sku ?? null,
            reorder_level: inventory?.reorder_level ?? 5,
            cost_price: inventory?.cost_price ?? null,
          },
        };
      });
      
      // Apply client-side filters
      if (filters?.inStock) {
        mergedProducts = mergedProducts.filter(p => p.inventory!.available_quantity > 0);
      }
      
      if (filters?.limit) {
        mergedProducts = mergedProducts.slice(0, filters.limit);
      }
      
      return mergedProducts;
    } catch (error) {
      console.error('Error getting products with inventory:', error);
      throw new Error('Failed to fetch products with inventory');
    }
  }

  // Get single product with inventory
  static async getProductWithInventory(productId: string): Promise<ProductWithInventory | null> {
    try {
      const products = await db
        .select({
          sanity_product_id: productInventory.sanity_product_id,
          stock_quantity: productInventory.stock_quantity,
          reserved_quantity: productInventory.reserved_quantity,
          sku: productInventory.sku,
          reorder_level: productInventory.reorder_level,
          cost_price: productInventory.cost_price,
        })
        .from(productInventory)
        .where(eq(productInventory.sanity_product_id, productId));
      
      if (products.length === 0) return null;
      
      const sanityProduct = await sanityClient.fetch(
        `*[_type == "product" && _id == $id][0]`,
        { id: productId }
      );
      
      if (!sanityProduct) return null;
      
      const inventory = products[0];
      const stockQuantity = inventory.stock_quantity;
      const reservedQuantity = inventory.reserved_quantity;
      const availableQuantity = Math.max(0, stockQuantity - reservedQuantity);
      
      return {
        ...sanityProduct,
        inventory: {
          stock_quantity: stockQuantity,
          reserved_quantity: reservedQuantity,
          available_quantity: availableQuantity,
          sku: inventory.sku,
          reorder_level: inventory.reorder_level,
          cost_price: inventory.cost_price,
        },
      };
    } catch (error) {
      console.error('Error getting single product with inventory:', error);
      return null;
    }
  }

  // Check product availability with better error handling
  static async checkAvailability(productId: string, quantity: number): Promise<{
    available: boolean;
    stock_quantity: number;
    available_quantity: number;
    message?: string;
  }> {
    try {
      const result = await db
        .select({
          stock_quantity: productInventory.stock_quantity,
          reserved_quantity: productInventory.reserved_quantity,
        })
        .from(productInventory)
        .where(eq(productInventory.sanity_product_id, productId));
      
      if (result.length === 0) {
        return {
          available: false,
          stock_quantity: 0,
          available_quantity: 0,
          message: 'Product not found in inventory',
        };
      }
      
      const { stock_quantity, reserved_quantity } = result[0];
      const available_quantity = Math.max(0, stock_quantity - reserved_quantity);
      
      return {
        available: available_quantity >= quantity,
        stock_quantity,
        available_quantity,
        message: available_quantity < quantity 
          ? `Only ${available_quantity} items available, but ${quantity} requested`
          : undefined,
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        available: false,
        stock_quantity: 0,
        available_quantity: 0,
        message: 'Error checking availability',
      };
    }
  }

  // Reserve inventory with transaction support
  static async reserveInventory(productId: string, quantity: number): Promise<{
    success: boolean;
    message?: string;
    reserved_quantity?: number;
  }> {
    try {
      // Execute the transaction manually to handle errors properly
      // Since drizzle-orm doesn't have transaction.rollback(), we need to handle errors differently
      let reservedQuantity = 0;
      
      // First check if product exists and has enough stock
      const checkResult = await db
        .select({
          stock_quantity: productInventory.stock_quantity,
          reserved_quantity: productInventory.reserved_quantity,
        })
        .from(productInventory)
        .where(eq(productInventory.sanity_product_id, productId));
      
      if (checkResult.length === 0) {
        return {
          success: false,
          message: 'Product not found in inventory',
        };
      }
      
      const { stock_quantity, reserved_quantity } = checkResult[0];
      const available = stock_quantity - reserved_quantity;
      
      if (available < quantity) {
        return {
          success: false,
          message: `Insufficient inventory. Available: ${available}, Requested: ${quantity}`,
        };
      }
      
      // Update the inventory - do this as atomically as possible
      const updateResult = await db
        .update(productInventory)
        .set({
          reserved_quantity: drizzleSql`${productInventory.reserved_quantity} + ${quantity}`,
          updated_at: new Date(),
        })
        .where(eq(productInventory.sanity_product_id, productId))
        .returning({
          reserved_quantity: productInventory.reserved_quantity,
        });
      
      if (updateResult.length === 0) {
        return {
          success: false,
          message: 'Failed to update inventory',
        };
      }
      
      reservedQuantity = updateResult[0].reserved_quantity;
      
      return {
        success: true,
        reserved_quantity: reservedQuantity,
        message: `Successfully reserved ${quantity} items`,
      };
    } catch (error) {
      console.error('Error reserving inventory:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reserve inventory',
      };
    }
  }

  // Release reserved inventory (for cancelled orders)
  static async releaseInventory(productId: string, quantity: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      // First check if product exists and has enough reserved stock
      const checkResult = await db
        .select({
          reserved_quantity: productInventory.reserved_quantity,
        })
        .from(productInventory)
        .where(eq(productInventory.sanity_product_id, productId));
      
      if (checkResult.length === 0) {
        return {
          success: false,
          message: 'Product not found in inventory',
        };
      }
      
      const { reserved_quantity } = checkResult[0];
      
      if (reserved_quantity < quantity) {
        return {
          success: false, 
          message: `Cannot release ${quantity} items. Only ${reserved_quantity} items are reserved.`,
        };
      }
      
      // Release inventory
      await db
        .update(productInventory)
        .set({
          reserved_quantity: drizzleSql`${productInventory.reserved_quantity} - ${quantity}`,
          updated_at: new Date(),
        })
        .where(eq(productInventory.sanity_product_id, productId));
      
      return {
        success: true,
        message: `Successfully released ${quantity} items from reservation`,
      };
    } catch (error) {
      console.error('Error releasing inventory:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to release inventory',
      };
    }
  }

  // Update inventory levels
  static async updateInventory(productId: string, data: InventoryUpdateData): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const updateData: any = {
        updated_at: new Date(),
      };
      
      if (data.stock_quantity !== undefined) updateData.stock_quantity = data.stock_quantity;
      if (data.reserved_quantity !== undefined) updateData.reserved_quantity = data.reserved_quantity;
      if (data.reorder_level !== undefined) updateData.reorder_level = data.reorder_level;
      if (data.cost_price !== undefined) updateData.cost_price = data.cost_price;
      if (data.sku !== undefined) updateData.sku = data.sku;
      
      await db
        .update(productInventory)
        .set(updateData)
        .where(eq(productInventory.sanity_product_id, productId));
      
      return {
        success: true,
        message: 'Inventory updated successfully',
      };
    } catch (error) {
      console.error('Error updating inventory:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update inventory',
      };
    }
  }

  // Get products that need reordering
  static async getProductsNeedingReorder(): Promise<ProductWithInventory[]> {
    try {
      const lowStockProducts = await db
        .select()
        .from(productInventory)
        .where(
          drizzleSql`(${productInventory.stock_quantity} - ${productInventory.reserved_quantity}) <= ${productInventory.reorder_level}`
        );
      
      if (lowStockProducts.length === 0) {
        return [];
      }
      
      const productIds = lowStockProducts.map(p => p.sanity_product_id);
      const sanityProducts = await sanityClient.fetch(
        `*[_type == "product" && _id in $productIds]`,
        { productIds }
      );
      
      return sanityProducts.map((product: any) => {
        const inventory = lowStockProducts.find(
          (inv) => inv.sanity_product_id === product._id
        )!;
        
        const stockQuantity = inventory.stock_quantity;
        const reservedQuantity = inventory.reserved_quantity;
        const availableQuantity = Math.max(0, stockQuantity - reservedQuantity);
        
        return {
          ...product,
          inventory: {
            stock_quantity: stockQuantity,
            reserved_quantity: reservedQuantity,
            available_quantity: availableQuantity,
            sku: inventory.sku,
            reorder_level: inventory.reorder_level,
            cost_price: inventory.cost_price,
          },
        };
      });
    } catch (error) {
      console.error('Error getting products needing reorder:', error);
      throw new Error('Failed to get products needing reorder');
    }
  }

  // Initialize inventory for new product
  static async initializeProductInventory(
    productId: string, 
    initialStock: number = 0,
    sku?: string,
    reorderLevel: number = 5,
    costPrice?: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if inventory already exists
      const existingInventory = await db
        .select({ id: productInventory.id })
        .from(productInventory)
        .where(eq(productInventory.sanity_product_id, productId));
      
      if (existingInventory.length > 0) {
        return {
          success: false,
          message: 'Product inventory already exists',
        };
      }
      
      await db
        .insert(productInventory)
        .values({
          sanity_product_id: productId,
          stock_quantity: initialStock,
          reserved_quantity: 0,
          reorder_level: reorderLevel,
          cost_price: costPrice,
          sku: sku || productId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      
      return {
        success: true,
        message: 'Product inventory initialized successfully',
      };
    } catch (error) {
      console.error('Error initializing product inventory:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initialize inventory',
      };
    }
  }
}