import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

interface CategoryQueryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategoryId?: string | null;
  slug?: string;
}

interface CategoryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategory: string | null;
}

function isSanityId(str: string) {
  // Sanity IDs are usually 24+ chars, slugs are shorter and URL-friendly
  return /^[a-zA-Z0-9_-]{16,}$/.test(str);
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

    const filter = searchParams.get("filter") || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search");

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const selectedCategoriesRaw =
      searchParams.get("selectedCategories")?.split(",").filter(Boolean) || [];
    const selectedSizesRaw =
      searchParams.get("selectedSizes")?.split(",").filter(Boolean) || [];
    const selectedColorsRaw =
      searchParams.get("selectedColors")?.split(",").filter(Boolean) || [];
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    // Helper to resolve slugs to IDs for categories, sizes, and colors
    async function resolveSlugsToIds(
      type: string,
      values: string[],
    ): Promise<string[]> {
      if (values.length === 0) return [];
      const ids: string[] = [];
      const slugs: string[] = [];
      values.forEach((val) => {
        if (isSanityId(val)) {
          ids.push(val);
        } else {
          slugs.push(val);
        }
      });
      if (slugs.length > 0) {
        const slugResults = await client.fetch(
          groq`*[_type == $type && slug.current in $slugs]{ _id, "slug": slug.current }`,
          { type, slugs },
        );
        ids.push(...slugResults.map((item: any) => item._id));
      }
      return ids;
    }

    // Resolve category slugs/ids
    const selectedCategories = await resolveSlugsToIds(
      "category",
      selectedCategoriesRaw,
    );
    // For subcategories, you may want to support them as well
    const selectedSubcategories = await resolveSlugsToIds(
      "subcategory",
      selectedCategoriesRaw,
    );
    // For size and color, use the raw string values (not IDs)
    const selectedSizes = selectedSizesRaw;
    const selectedColors = selectedColorsRaw;

    const baseFilterConditions = [
      "_type == 'product'",
      "!(_id in path('drafts.**'))",
      "status == 'active'",
    ];

    // Add search condition if search parameter exists
    if (search) {
      const sanitizedSearch = search.replace(/['"\\]/g, "").trim();
      if (sanitizedSearch) {
        const searchTerms = sanitizedSearch.toLowerCase().split(/\s+/);
        const searchConditions = searchTerms.map(
          (term) => `(
          lower(name) match "*${term}*" ||
          lower(description) match "*${term}*" ||
          lower(materialType) match "*${term}*" ||
          lower(brand->name) match "*${term}*" ||
          count(variants[]->colorVariants[lower(color) match "*${term}*"]) > 0
        )`,
        );
        baseFilterConditions.push(`(${searchConditions.join(" && ")})`);
      }
    }

    if (category) {
      baseFilterConditions.push(`category._ref == "${category}"`);
    }

    if (subcategory) {
      baseFilterConditions.push(
        `count(subcategory[_ref == "${subcategory}"]) > 0`,
      );
    }

    if (minPrice && maxPrice) {
      const minPriceNum = parseFloat(minPrice);
      const maxPriceNum = parseFloat(maxPrice);
      baseFilterConditions.push(
        `coalesce((variants[]->price)[0], 0) >= ${minPriceNum} && coalesce((variants[]->price)[0], 0) <= ${maxPriceNum}`,
      );
    }

    // --- CATEGORY FILTERS (support both category and subcategory IDs) ---
    if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
      const effectiveCategoryFilterClauses: string[] = [];
      if (selectedSubcategories.length > 0) {
        effectiveCategoryFilterClauses.push(
          `count(subcategory[_ref in [${selectedSubcategories.map((id) => `"${id}"`).join(",")} ]]) > 0`,
        );
      }
      if (selectedCategories.length > 0) {
        effectiveCategoryFilterClauses.push(
          `category._ref in [${selectedCategories.map((id) => `"${id}"`).join(",")}]`,
        );
      }
      if (effectiveCategoryFilterClauses.length > 0) {
        baseFilterConditions.push(
          `(${effectiveCategoryFilterClauses.join(" || ")})`,
        );
      }
    }

    // --- SIZE FILTERS ---
    if (selectedSizes.length > 0) {
      baseFilterConditions.push(
        `count(variants[]->[size in [${selectedSizes.map((size) => `"${size}"`).join(",")}]]) > 0`,
      );
    }
    // --- COLOR FILTERS ---
    if (selectedColors.length > 0) {
      baseFilterConditions.push(
        `count(variants[]->colorVariants[color in [${selectedColors.map((color) => `"${color}"`).join(",")}]]) > 0`,
      );
    }
    if (featured === "true") {
      baseFilterConditions.push("featured == true");
    }

    const finalFilterConditions = baseFilterConditions.join(" && ");

    const orderBy =
      filter === "latest"
        ? "| order(_createdAt desc)"
        : filter === "price_low_to_high"
          ? "| order(coalesce((variants[]->price)[0], 0) asc)"
          : filter === "price_high_to_low"
            ? "| order(coalesce((variants[]->price)[0], 0) desc)"
            : "| order(_createdAt desc)";

    const query = groq`*[${finalFilterConditions}] ${orderBy} [${skip}...${skip + limit}] {
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      description,
      "searchScore": select(
        ${
          search
            ? `
          (lower(name) match "*${search.toLowerCase()}*") => 5,
          (lower(brand->name) match "*${search.toLowerCase()}*") => 4,
          (lower(description) match "*${search.toLowerCase()}*") => 3,
          (lower(materialType) match "*${search.toLowerCase()}*") => 2,
          count(variants[]->colorVariants[lower(color) match "*${search.toLowerCase()}*"]) > 0 => 1,
        `
            : ""
        } true => 0
      ),
      "matchedFields": select(
        ${
          search
            ? `
          defined(name) && lower(name) match "*${search.toLowerCase()}*" => ["name"],
          defined(brand->name) && lower(brand->name) match "*${search.toLowerCase()}*" => ["brand"],
          defined(description) && lower(description) match "*${search.toLowerCase()}*" => ["description"],
          defined(materialType) && lower(materialType) match "*${search.toLowerCase()}*" => ["materialType"],
          count(variants[]->colorVariants[lower(color) match "*${search.toLowerCase()}*"]) > 0 => ["color"],
        `
            : ""
        } true => []
      ),
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
          stock
        }
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
