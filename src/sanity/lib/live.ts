import { defineLive } from "next-sanity";
import { sanityClient } from "./client";

// Configure Sanity client for live updates
export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient.withConfig({
    // Use a stable API version for production reliability
    apiVersion: "2025-07-01",
    // Enable CDN for faster reads in production, disable in development for fresher data
    useCdn: process.env.NODE_ENV === "production",
    // Optionally add a token for authenticated access (uncomment if needed)
    // token: process.env.SANITY_READ_TOKEN,
  }),
});

// Type definition for sanityFetch to improve type safety
export type SanityFetchOptions<T> = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
};

// Re-export sanityFetch with explicit typing for better IDE support
export const typedSanityFetch = async <T>({ query, params = {}, tags }: SanityFetchOptions<T>): Promise<T> => {
  try {
    const { data } = await sanityFetch({ query, params, tags });
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    throw error;
  }
};
