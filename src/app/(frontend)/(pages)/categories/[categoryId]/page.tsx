import React from "react";
import { groq } from "next-sanity";
import { client } from "@/lib/client";
import { Category } from "../../../../../../sanity.types";
import { Metadata } from "next";
import CategoryDetail from "./categoryDetail";

// Fetch category data
async function getCategory(id: string): Promise<Category | null> {
  return await client.fetch(
    groq`*[_type == "category" && _id == $id][0]{
          _id,
          name,
          description,
          seo,
          "images": {
            "primary": {
              "url": images.primary.asset->url,
              "alt": images.primary.alt
            }
          }
        }`,
    { id },
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const id = (await params).id;
  const category = await getCategory(id);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: category.seo?.metaTitle || category.title,
    description: category.seo?.metaDescription || category.description,
    keywords: category.seo?.keywords,
    openGraph: {
      title: category.seo?.metaTitle || category.title,
      description: category.seo?.metaDescription || category.description,
    },
  };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return <CategoryDetail id={id} />;
};

export default Page;
