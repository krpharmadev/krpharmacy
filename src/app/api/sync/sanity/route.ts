import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { createClient } from '@sanity/client';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // We need fresh data
  token: process.env.SANITY_API_TOKEN, // Only needed for writing
  apiVersion: '2023-05-03',
});

/**
 * POST /api/sync/sanity
 * Sync products between Sanity and PostgreSQL using SKU
 */
export async function POST(request: NextRequest) {
  try {
    const { entityType, sanityId, action = 'sync' } = await request.json();

    if (!entityType || !sanityId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Only allow certain entity types
    if (!['product', 'variant', 'category'].includes(entityType)) {
      return NextResponse.json({ success: false, error: 'Invalid entity type' }, { status: 400 });
    }

    // Get the document from Sanity
    const sanityDocument = await sanityClient.fetch(`*[_id == $id][0]`, { id: sanityId });

    if (!sanityDocument) {
      return NextResponse.json({ success: false, error: 'Sanity document not found' }, { status: 404 });
    }

    // Handle different entity types
    if (entityType === 'product') {
      const { sku } = sanityDocument;
      
      if (!sku) {
        return NextResponse.json({ success: false, error: 'SKU is required for syncing products' }, { status: 400 });
      }

      // Connect to PostgreSQL
      const client = await pool.connect();
      try {
        // Start transaction
        await client.query('BEGIN');

        if (action === 'sync') {
          // Sync product by SKU
          const result = await client.query(
            'SELECT sync_product_by_sku($1, $2) as pg_id',
            [sku, sanityId]
          );

          const pgId = result.rows[0]?.pg_id;

          if (!pgId) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, error: 'Product with this SKU not found in PostgreSQL' }, { status: 404 });
          }

          await client.query('COMMIT');
          return NextResponse.json({ 
            success: true, 
            data: { 
              entityType, 
              sanityId, 
              pgId, 
              sku 
            } 
          });
        } else if (action === 'create' || action === 'update') {
          // Create or update product in PostgreSQL based on Sanity data
          // Implementation depends on your specific data model
          // ...

          await client.query('COMMIT');
          return NextResponse.json({ success: true, data: { entityType, sanityId, action } });
        } else {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('PostgreSQL error:', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
      } finally {
        client.release();
      }
    } else if (entityType === 'variant') {
      // Similar implementation for variant syncing
      // ...
    } else if (entityType === 'category') {
      // Similar implementation for category syncing
      // ...
    }

    return NextResponse.json({ success: false, error: 'Implementation not complete for this entity type' }, { status: 501 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * GET /api/sync/sanity
 * Get mapping between Sanity and PostgreSQL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const sanityId = searchParams.get('sanityId');
    const pgId = searchParams.get('pgId');
    const sku = searchParams.get('sku');

    if (!entityType || (!sanityId && !pgId && !sku)) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    // Connect to PostgreSQL
    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM sanity_sync WHERE entity_type = $1';
      const params = [entityType];

      if (sanityId) {
        query += ' AND sanity_id = $2';
        params.push(sanityId);
      } else if (pgId) {
        query += ' AND pg_id = $2';
        params.push(pgId);
      } else if (sku) {
        query += ' AND sanity_sku = $2';
        params.push(sku);
      }

      const result = await client.query(query, params);

      return NextResponse.json({ 
        success: true, 
        data: result.rows 
      });
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
} 