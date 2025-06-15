import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

interface CategoryQueryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategoryId?: string | null; // For subcategories, this will be parent's _id
}

interface CategoryResult {
  _id: string;
  _type: "category" | "subcategory";
  parentCategory: string | null;
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
    const selectedSizes =
      searchParams.get("selectedSizes")?.split(",").filter(Boolean) || [];
    const selectedColors =
      searchParams.get("selectedColors")?.split(",").filter(Boolean) || [];
    const selectedCategoriesFromURL =
      searchParams.get("selectedCategories")?.split(",").filter(Boolean) || [];
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

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

    if (selectedCategoriesFromURL.length > 0) {
      const categoryQueryResults: CategoryQueryResult[] = await client.fetch(
        groq`*[_id in $ids] {
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

      const effectiveCategoryFilterClauses: string[] = [];

      if (selectedSubCategoryIds.size > 0) {
        effectiveCategoryFilterClauses.push(
          `count(subcategory[_ref in [${Array.from(selectedSubCategoryIds)
            .map((id) => `"${id}"`)
            .join(",")}]]) > 0`,
        );
      }

      selectedMainCategoryIds.forEach((mainCatId) => {
        const hasDirectlySelectedChildSubcategory = categoryQueryResults.some(
          (item) =>
            item._type === "subcategory" &&
            item.parentCategoryId === mainCatId &&
            selectedSubCategoryIds.has(item._id),
        );
        if (!hasDirectlySelectedChildSubcategory) {
          effectiveCategoryFilterClauses.push(
            `category._ref == "${mainCatId}"`,
          );
        }
      });

      if (effectiveCategoryFilterClauses.length > 0) {
        baseFilterConditions.push(
          `(${effectiveCategoryFilterClauses.join(" || ")})`,
        );
      }
    }

    if (selectedSizes.length > 0) {
      baseFilterConditions.push(
        `count(variants[]->[size in [${selectedSizes.map((size) => `"${size}"`).join(",")} ]]) > 0`,
      );
    }

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
