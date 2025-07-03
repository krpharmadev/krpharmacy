import { sanityFetch } from "../lib/live";
import {
  ALL_PRODUCTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_BY_ATC_CODE_QUERY,
  OTC_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  ALL_CATEGORIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  LOW_STOCK_PRODUCTS_QUERY,
  CUSTOMER_CATEGORIES_QUERY,
  PRODUCTS_BY_DOSAGE_FORM_QUERY,
} from "./query";

// Get all active products for general browsing
const getAllProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all products:", error);
    return [];
  }
};

// Get products by category slug
const getProductsByCategory = async (categorySlug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching products by category:", error);
    return [];
  }
};

// Get products by ATC code for pharmacists/doctors
const getProductsByAtcCode = async (atcCode: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_ATC_CODE_QUERY,
      params: { atcCode },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching products by ATC code:", error);
    return [];
  }
};

// Get OTC products for general customers
const getOtcProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: OTC_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching OTC products:", error);
    return [];
  }
};

// Search products by name or description
const getProductsBySearch = async (searchTerm: string) => {
  try {
    const { data } = await sanityFetch({
      query: SEARCH_PRODUCTS_QUERY,
      params: { searchTerm },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching products by search:", error);
    return [];
  }
};

// Get all categories with optional quantity limit
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == "category"] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : ALL_CATEGORIES_QUERY;
    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching categories:", error);
    return [];
  }
};

// Get product details by slug
const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

// Get products with low stock
const getLowStockProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: LOW_STOCK_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching low stock products:", error);
    return [];
  }
};

// Get all active customer categories
const getCustomerCategories = async () => {
  try {
    const { data } = await sanityFetch({ query: CUSTOMER_CATEGORIES_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching customer categories:", error);
    return [];
  }
};

// Get products by dosage form
const getProductsByDosageForm = async (dosageForm: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_DOSAGE_FORM_QUERY,
      params: { dosageForm },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching products by dosage form:", error);
    return [];
  }
};

export {
  getAllProducts,
  getProductsByCategory,
  getProductsByAtcCode,
  getOtcProducts,
  getProductsBySearch,
  getCategories,
  getProductBySlug,
  getLowStockProducts,
  getCustomerCategories,
  getProductsByDosageForm,
};