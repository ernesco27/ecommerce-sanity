import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

interface CategoryQueryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategoryId?: string | null;
}

// Define the product query with all necessary fields
const productsQuery = groq`*[_type == "product" && !(_id in path("drafts.**")) && status == "active"] {
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const featured = searchParams.get("featured");
    const filter = searchParams.get("filter") || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter string
    let filterString = "";
    const filterConditions = [];

    if (category) {
      filterConditions.push(`category._ref == "${category}"`);
    }

    if (subcategory) {
      filterConditions.push(`"${subcategory}" in subcategory[]._ref`);
    }

    if (featured === "true") {
      filterConditions.push("featured == true");
    }

    if (filterConditions.length > 0) {
      filterString = ` && ${filterConditions.join(" && ")}`;
    }

    // Order by based on filter type
    const orderBy =
      filter === "latest"
        ? "order(_createdAt desc)"
        : filter === "price_low_to_high"
          ? "order(coalesce((variants[]->price)[0], 0) asc)"
          : filter === "price_high_to_low"
            ? "order(coalesce((variants[]->price)[0], 0) desc)"
            : "order(_createdAt desc)";

    const query = groq`*[_type == "product" && !(_id in path("drafts.**")) && status == "active"${filterString}] | ${orderBy} [${skip}...${skip + limit}] {
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      description,
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
          "alt": alt,
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
          stock
        }
      }
    }`;

    const products = await client.fetch(query);

    return NextResponse.json(products, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
