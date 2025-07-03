import { defineQuery } from "next-sanity";

// Get all active products for general browsing
const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && status == "active"] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "category": category->{
      name,
      slug
    }
  }
`);

// Get products by category slug for browsing specific categories (e.g., vitamins, medical devices)
const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product" && status == "active" && category->slug.current == $categorySlug] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "category": category->{
      name,
      slug
    }
  }
`);

// Get products by ATC code for pharmacists/doctors
const PRODUCTS_BY_ATC_CODE_QUERY = defineQuery(`
  *[_type == "product" && status == "active" && drugDetails->atcCode == $atcCode] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "drugDetails": drugDetails->{
      drugName,
      genericName,
      dosageForm,
      atcCode,
      fdaNumber,
      prescriptionStatus
    },
    "category": category->{
      name,
      slug
    }
  }
`);

// Get OTC products for general customers
const OTC_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && status == "active" && drugDetails->prescriptionStatus == "otc"] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "drugDetails": drugDetails->{
      drugName,
      genericName,
      dosageForm,
      prescriptionStatus
    },
    "category": category->{
      name,
      slug
    }
  }
`);

// Search products by name or description
const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && status == "active" && (name match $searchTerm || description match $searchTerm)] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "category": category->{
      name,
      slug
    }
  }
`);

// Get all categories with subcategories and product count
const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    "parentCategory": parentCategory->{
      name,
      slug
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`);

// Get product details by slug for product page
const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    sku,
    barcode,
    description,
    price,
    costPrice,
    stock,
    "images": images[].asset->url,
    status,
    slug,
    "category": category->{
      name,
      slug,
      "parentCategory": parentCategory->{
        name,
        slug
      }
    },
    "drugDetails": drugDetails->{
      drugName,
      genericName,
      dosageForm,
      atcCode,
      fdaNumber,
      prescriptionStatus,
      storageConditions
    }
  }
`);

// Get products with low stock (stock < 10)
const LOW_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && stock < 10 && status == "active"] | order(stock asc) {
    _id,
    name,
    sku,
    stock,
    price,
    "category": category->{
      name,
      slug
    }
  }
`);

// Get all active customer categories
const CUSTOMER_CATEGORIES_QUERY = defineQuery(`
  *[_type == "customerCategory" && isActive == true] | order(name asc) {
    _id,
    name,
    slug,
    description
  }
`);

// Get products by dosage form (e.g., tablet, capsule)
const PRODUCTS_BY_DOSAGE_FORM_QUERY = defineQuery(`
  *[_type == "product" && status == "active" && drugDetails->dosageForm == $dosageForm] | order(name asc) {
    _id,
    name,
    sku,
    price,
    "image": images[0].asset->url,
    slug,
    "drugDetails": drugDetails->{
      drugName,
      genericName,
      dosageForm,
      prescriptionStatus
    },
    "category": category->{
      name,
      slug
    }
  }
`);

export {
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
};