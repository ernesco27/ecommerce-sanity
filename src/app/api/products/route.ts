import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

// Define the product query with all necessary fields
const productsQuery = groq`*[_type == "product"] {
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  description,
  fullDescription,
  materialType,
  status,
  featured,
  visibility {
    isVisible,
    publishDate,
    unpublishDate
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current
  },
  "subcategories": subcategory[]->{
    _id,
    name,
    "slug": slug.current,
    "parentCategory": parentCategory->{
      _id,
      title
    }
  },
  "brand": brand->{
    _id,
    name,
    "slug": slug.current
  },
  "images": {
    "primary": images.primary{
      "url": asset->url,
      alt,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "gallery": images.gallery[]{
      "url": asset->url,
      alt,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  },
  "variants": variants[]->{
    _id,
    size,
    price,
    compareAtPrice,
    sku,
    colorVariants[] {
      color,
      colorCode,
      stock,
      "images": images[]{
        "url": asset->url,
        alt,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions
      }
    }
  },
  "pricing": {
    "min": coalesce((variants[]->price)[0], 0),
    "max": coalesce((variants[]->price)[-1], 0)
  },
  "reviews": reviews[]->{
    _id,
    _createdAt,
    reviewTitle,
    reviewDetails,
    rating,
    verifiedPurchase,
    "user": user->{
      _id,
      firstName,
      lastName,
      email,
      isEmailVerified,
      "photo": photo.asset->
    },
    "images": images[]->{
      _id,
      title,
      altText,
      "images": images[]{
        "asset": {
          "url": asset->url
        }
      }
    }
  },
  "relatedProducts": relatedProducts[]->{ 
    _id,
    name,
    "slug": slug.current,
    "primaryImage": images.primary{
      "url": asset->url,
      alt,
      "lqip": asset->metadata.lqip
    }
  }
} | order(coalesce((variants[]->price)[0], 0) asc)`;

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const featured = searchParams.get("featured") === "true";
    const isVisible = searchParams.get("visible");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const sortBy = searchParams.get("sort") || "default";

    // Build filters array
    const filters: string[] = [];

    if (category) {
      filters.push(`category->slug.current == "${category}"`);
    }
    if (subcategory) {
      filters.push(`"${subcategory}" in subcategory[]->slug.current`);
    }
    if (featured) {
      filters.push(`featured == true`);
    }
    if (isVisible !== null) {
      filters.push(`visibility.isVisible == ${isVisible === "true"}`);
    }
    if (size) {
      filters.push(`"${size}" in variants[]->size`);
    }
    if (color) {
      filters.push(`"${color}" in variants[]->colorVariants[].color`);
    }
    if (minPrice !== undefined) {
      filters.push(`coalesce((variants[]->price)[0], 0) >= ${minPrice}`);
    }
    if (maxPrice !== undefined) {
      filters.push(`coalesce((variants[]->price)[-1], 0) <= ${maxPrice}`);
    }

    // Build the order clause
    let orderClause = "| order(_createdAt desc)";
    switch (sortBy) {
      case "price-asc":
        orderClause = "| order(coalesce((variants[]->price)[0], 0) asc)";
        break;
      case "price-desc":
        orderClause = "| order(coalesce((variants[]->price)[0], 0) desc)";
        break;
      case "newest":
        orderClause = "| order(_createdAt desc)";
        break;
      case "oldest":
        orderClause = "| order(_createdAt asc)";
        break;
    }

    // Apply filters if any exist
    let finalQuery = productsQuery;
    if (filters.length > 0) {
      const filterString = filters.join(" && ");
      const baseQuery = productsQuery.substring(productsQuery.indexOf("{"));
      finalQuery = groq`*[_type == "product" && ${filterString}]${baseQuery}`;
    }

    // Remove the default order from productsQuery and apply the new order clause
    finalQuery =
      finalQuery.replace(
        "| order(coalesce((variants[]->price)[0], 0) asc)",
        "",
      ) + orderClause;

    // Fetch products from Sanity with parameters
    const products = await client.fetch(finalQuery);

    // Apply limit if specified
    const limitedProducts = limit ? products.slice(0, limit) : products;

    return NextResponse.json(limitedProducts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error: (error as Error).message },
      { status: 500 },
    );
  }
}
