import Image from 'next/image';
import Link from 'next/link';
import { ProductWithInventory } from '@/lib/data/products';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithInventory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  
  const isOutOfStock = product.inventory?.available_quantity === 0;
  
  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('สินค้าหมด', {
        description: 'สินค้านี้หมดแล้ว กรุณาเลือกสินค้าอื่น',
      });
      return;
    }
    
    const success = await addToCart(product, 1);
    
    if (success) {
      toast.success('เพิ่มลงตะกร้าแล้ว', {
        description: `เพิ่ม ${product.name} ลงตะกร้าแล้ว`,
      });
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.slug?.current}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">ไม่มีรูปภาพ</span>
            </div>
          )}
          
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              ลด {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
            </div>
          )}
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium px-3 py-1 bg-red-500 rounded">
                สินค้าหมด
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="pt-4 flex-grow">
        <Link href={`/products/${product.slug?.current}`} className="block">
          <h3 className="text-base font-medium line-clamp-2 min-h-[3rem]">{product.name}</h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">฿{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ฿{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {!isOutOfStock && (
            <span className="text-xs text-green-600">
              เหลือ {product.inventory?.available_quantity || 0}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full" 
          disabled={isLoading || isOutOfStock}
          variant={isOutOfStock ? "outline" : "default"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
        </Button>
      </CardFooter>
    </Card>
  );
} 