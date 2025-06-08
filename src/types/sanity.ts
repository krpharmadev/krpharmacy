// Types for Sanity documents and sync operations

export interface SanityDocumentBase {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityProduct extends SanityDocumentBase {
  _type: 'product';
  name: string;
  nameEn?: string;
  slug: {
    current: string;
    _type: 'slug';
  };
  sku: string;
  price: number;
  description?: string;
  // Add other product fields as needed
}

export interface SanityProductVariant {
  _key: string;
  variantName: string;
  sku: string;
  price: number;
  // Add other variant fields as needed
}

export interface SanitySyncMap {
  entityType: 'product' | 'variant' | 'category';
  sanityId: string;
  pgId: number;
  sku?: string;
  lastSyncedAt: string;
}

export interface SyncRequest {
  entityType: 'product' | 'variant' | 'category';
  sanityId: string;
  action?: 'sync' | 'create' | 'update';
}

export interface SyncResponse {
  success: boolean;
  data?: {
    entityType: string;
    sanityId: string;
    pgId?: number;
    sku?: string;
  };
  error?: string;
} 