"use client";

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schema } from "./src/sanity/schemaTypes";
import { structure, defaultDocumentNode } from "./src/sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  name: "ecommerce-sanity",
  title: "E-commerce Admin",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode,
    }),
    visionTool(),
    colorInput(),
  ],
  schema: {
    types: schema.types,
  },
});
