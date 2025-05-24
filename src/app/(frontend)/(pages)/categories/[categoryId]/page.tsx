import React from "react";
import { groq } from "next-sanity";
import { client } from "@/lib/client";
import { Category } from "../../../../../../sanity.types";
import { Metadata } from "next";
import CategoryDetail from "./CategoryDetail";

// Fetch category data
async function getCategory(id: string): Promise<Category | null> {
  return await client.fetch(
    groq`*[_type == "category" && _id == $id][0]{
          _id,
          title,
          description,
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
            "image": {
              "url": image.asset->url,
              "alt": image.alt
            }
          }
        }`,
    { id },
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: { categoryId: string };
}): Promise<Metadata> => {
  const category = await getCategory(params.categoryId);

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

const Page = async ({ params }: { params: { categoryId: string } }) => {
  const category = await getCategory(params.categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryDetail category={category} />;
};

export default Page;
