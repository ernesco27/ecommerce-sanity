import React from "react";
import { groq } from "next-sanity";
import { client } from "@/lib/client";
import { Category } from "../../../../../../sanity.types";
import { Metadata } from "next";
import CategoryDetail from "./CategoryDetail";

// Fetch category data
async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await client.fetch(
      groq`*[_type == "category" && slug.current == $slug][0]{
            _id,
            title,
            description,
            "slug": slug.current,
            seo,
            "images": {
              "primary": {
                "url": image.asset->url,
                "alt": image.alt
              }
            },
            "subcategories": subcategories[]->{
              _id,
              name,
              description,
              "slug": slug.current,
              "image": {
                "url": image.asset->url,
                "alt": image.alt
              }
            }
          }`,
      { slug },
    );

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  const category = await getCategory(slug);

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

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600">
            The category "{slug}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  return <CategoryDetail category={category} />;
};

export default Page;
