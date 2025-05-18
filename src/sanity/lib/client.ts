import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

// Export a preview client for authenticated requests
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
