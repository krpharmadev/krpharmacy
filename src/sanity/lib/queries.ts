import { defineQuery } from 'next-sanity'

export const PRODUCT_QUERY = `
  *[_type == "product" && status == "active"] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    compareAtPrice,
    "images": images[] {
      "url": asset->url,
      alt
    },
    category-> {
      _id,
      name,
      "slug": slug.current
    },
    subcategory-> {
      _id,
      name,
      "slug": slug.current
    },
    tags,
    specifications,
    featured,
    _createdAt,
    _updatedAt
  }
`;

export const SINGLE_PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    compareAtPrice,
    "images": images[] {
      "url": asset->url,
      alt
    },
    category-> {
      _id,
      name,
      "slug": slug.current
    },
    subcategory-> {
      _id,
      name,
      "slug": slug.current
    },
    tags,
    specifications,
    featured,
    _createdAt,
    _updatedAt
  }
`;

export const CATEGORIES_QUERY = `
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url
  }
`;

export const SINGLE_CATEGORY_QUERY = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url
  }
`;

export const SUBCATEGORIES_BY_CATEGORY_QUERY = `
  *[_type == "subcategory" && category._ref == $categoryId] {
    _id,
    name,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url,
    category-> {
      _id,
      name,
      "slug": slug.current
    }
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
  *[_type == "product" && featured == true && status == "active"] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    compareAtPrice,
    "images": images[] {
      "url": asset->url,
      alt
    },
    category-> {
      _id,
      name,
      "slug": slug.current
    }
  }
`; 

export const CATEGORY_QUERY = defineQuery(`
  *[_type == "category"]{
    _id,
    name,
    slug,
    description,
    "parent": parentCategory->{
      _id,
      name,
      slug
    }
  }
`)

export const MAIN_CATEGORY_QUERY = defineQuery(`
  *[_type == "category" && !defined(parentCategory)]{
    _id,
    name,
    slug,
    description
  }
`)
