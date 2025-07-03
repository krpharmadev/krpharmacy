import { createClient } from 'next-sanity';
import { ALL_CATEGORIES_QUERY } from '@/sanity/queries/query';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: true,
});

export async function fetchCategories() {
  return await client.fetch(ALL_CATEGORIES_QUERY);
} 