import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { message: "Product slug is required." },
      { status: 400 },
    );
  }

  try {
    // 1. Fetch the main product (with tags)
    const product = await client.fetch(
      groq`*[_type == "product" && slug.current == $slug][0]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        description,
        fullDescription,
        materialType,
        status,
        featured,
        tags,
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
        }
      }`,
      { slug },
    );

    if (!product) throw new NotFoundError("Product");

    // 2. Fetch related products if tags exist
    let relatedProducts = [];
    if (product.tags && product.tags.length > 0) {
      relatedProducts = await client.fetch(
        groq`*[
          _type == "product" &&
          slug.current != $slug &&
          count(tags) > 0 &&
          count(tags[@ in $tags]) > 0
        ] | order(_createdAt desc) [0...10]{
          _id,
          _createdAt,
          name,
          "slug": slug.current,
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
          "reviews": reviews[]->{
            _id,
            _createdAt,
        
            rating,
        
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
          }
        }`,
        { slug, tags: product.tags },
      );
    }

    // Attach relatedProducts to the product object
    const productWithRelated = { ...product, relatedProducts };

    return NextResponse.json(productWithRelated, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
