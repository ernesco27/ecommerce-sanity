import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ProductDetail from "@/app/(frontend)/(pages)/products/[slug]/ProductDetail";
import React from "react";

// This type should match your Sanity schema
export type Product = {
  _id: string;
  name: string;
  description: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  images?: {
    primary?: {
      url: string;
      alt?: string;
    };
  };
};

// Fetch product data
async function getProduct(slug: string): Promise<Product | null> {
  return await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
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
    { slug },
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.description,
    keywords: product.seo?.keywords,
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || product.description,
      images: product.images?.primary?.url ? [product.images.primary.url] : [],
    },
    alternates: {
      canonical: product.seo?.canonicalUrl,
    },
  };
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
