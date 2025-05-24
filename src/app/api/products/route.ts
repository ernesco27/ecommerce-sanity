import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

interface CategoryQueryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategoryId?: string | null;
}

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
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const filter = searchParams.get("filter") || "latest";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 10000;
    const selectedSizes =
      searchParams.get("selectedSizes")?.split(",").filter(Boolean) || [];
    const selectedColors =
      searchParams.get("selectedColors")?.split(",").filter(Boolean) || [];
    const selectedCategoriesFromURL =
      searchParams.get("selectedCategories")?.split(",").filter(Boolean) || [];

    // Build filter conditions
    const filterConditions = [];

    // Price filter
    if (minPrice > 0 || maxPrice < 10000) {
      filterConditions.push(
        `count((variants[]->price)[@ >= ${minPrice} && @ <= ${maxPrice}]) > 0`,
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filterConditions.push(
        `count((variants[]->size)[@ in [${selectedSizes.map((s) => `"${s}"`).join(",")}]]) > 0`,
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filterConditions.push(
        `count((variants[]->colorVariants[].color)[@ in [${selectedColors.map((c) => `"${c}"`).join(",")}]]) > 0`,
      );
    }

    // Category and Subcategory filtering logic
    if (selectedCategoriesFromURL.length > 0) {
      const categoryQueryResults: CategoryQueryResult[] = await client.fetch(
        `*[_id in $ids] {
          _id,
          _type,
          "parentCategoryId": select(_type == "subcategory" => parentCategory._ref, null)
        }`,
        { ids: selectedCategoriesFromURL },
      );

      const selectedMainCategoryIds = new Set<string>();
      const selectedSubCategoryIds = new Set<string>();

      categoryQueryResults.forEach((item) => {
        if (item._type === "category") {
          selectedMainCategoryIds.add(item._id);
        } else if (item._type === "subcategory") {
          selectedSubCategoryIds.add(item._id);
        }
      });

      const effectiveFilterClauses: string[] = [];

      // Add subcategory filters first
      if (selectedSubCategoryIds.size > 0) {
        effectiveFilterClauses.push(
          `count(subcategory[_ref in ["${Array.from(selectedSubCategoryIds).join('","')}"]]) > 0`,
        );
      }

      // Add main category filters only if they don't have an explicitly selected subcategory
      selectedMainCategoryIds.forEach((mainCatId) => {
        const hasChildSubcategorySelected = categoryQueryResults.some(
          (item) =>
            item._type === "subcategory" &&
            item.parentCategoryId === mainCatId &&
            selectedSubCategoryIds.has(item._id),
        );
        if (!hasChildSubcategorySelected) {
          effectiveFilterClauses.push(`category._ref == "${mainCatId}"`);
        }
      });

      if (effectiveFilterClauses.length > 0) {
        filterConditions.push(`(${effectiveFilterClauses.join(" || ")})`);
      }
    }

    // Combine all filters
    const filterString =
      filterConditions.length > 0 ? ` && ${filterConditions.join(" && ")}` : "";

    // Order by based on filter type
    const orderBy =
      filter === "latest"
        ? "order(_createdAt desc)"
        : filter === "price_low_to_high"
          ? "order(coalesce((variants[]->price)[0], 0) asc)"
          : filter === "price_high_to_low"
            ? "order(coalesce((variants[]->price)[0], 0) desc)"
            : "order(_createdAt desc)";

    const query = groq`*[_type == "product"${filterString}] | ${orderBy} [${skip}...${skip + limit}] {
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
      { message: "Error fetching products", error: (error as Error).message },
      { status: 500 },
    );
  }
}
