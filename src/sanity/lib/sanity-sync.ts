import type { SanityDocumentBase, SyncResponse } from '@/types/sanity';

const SYNC_ENDPOINT = '/api/sync/sanity';

/**
 * Sync a Sanity document with PostgreSQL
 */
export async function syncSanityDocument(
  document: SanityDocumentBase,
  action: 'sync' | 'create' | 'update' = 'sync'
): Promise<SyncResponse> {
  try {
    // Skip sync for certain document types
    if (!['product', 'category'].includes(document._type)) {
      return {
        success: false,
        error: `Document type ${document._type} is not supported for syncing`
      };
    }

    const entityType = document._type === 'product' ? 'product' : 'category';

    const response = await fetch(SYNC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entityType,
        sanityId: document._id,
        action,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Failed to sync document: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during sync'
    };
  }
}

/**
 * Get mapping information between Sanity and PostgreSQL
 */
export async function getSyncMapping(params: {
  entityType: 'product' | 'variant' | 'category';
  sanityId?: string;
  pgId?: number;
  sku?: string;
}): Promise<SyncResponse> {
  try {
    const { entityType, sanityId, pgId, sku } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.set('entityType', entityType);
    
    if (sanityId) queryParams.set('sanityId', sanityId);
    if (pgId) queryParams.set('pgId', pgId.toString());
    if (sku) queryParams.set('sku', sku);

    const response = await fetch(`${SYNC_ENDPOINT}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Failed to get sync mapping: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Get sync mapping error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error getting sync mapping'
    };
  }
}

/**
 * Sanity document change handler - this can be used with Sanity webhooks
 * or client-side document subscription
 */
export function handleSanityDocumentChange(document: SanityDocumentBase): void {
  // Skip if document doesn't have a type we care about
  if (!['product', 'category'].includes(document._type)) {
    return;
  }

  // Sync the document
  syncSanityDocument(document, 'update')
    .then((result) => {
      if (result.success) {
        console.log(`Synced ${document._type} document:`, result.data);
      } else {
        console.error(`Failed to sync ${document._type} document:`, result.error);
      }
    })
    .catch((error) => {
      console.error(`Error syncing ${document._type} document:`, error);
    });
} 