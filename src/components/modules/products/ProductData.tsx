"use client";

import Container from "@/components/custom/Container";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import CustomButton from "@/components/custom/CustomButton";

//import ProductVariants from "@/components/custom/ProductVariants";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
//import { Product, ProductItem, ProductItemVariantValue } from "@/types";
import { Heart, Loader2, Star } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";

//import { cn, findSelectedItemDetails } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

//import { useProduct } from "./ProductContext";
import { Input } from "@/components/ui/input";

import NumberInput from "@/components/custom/NumberInput";
//import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Product, ProductVariant, Color } from "../../../../sanity.types";
import ProductMedia from "./ProductMedia";
import Loading from "./Loading";
import ProductVariants from "./ProductVariants";
import { cn } from "@/lib/utils";
import Services from "../home/Services";
import ProductInfo from "./ProductInfo";
import { PortableText } from "@portabletext/react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
type ColorName =
  | "red"
  | "green"
  | "blue"
  | "black"
  | "white"
  | "gray"
  | "navy"
  | "brown";

interface ColorVariant {
  color?: ColorName;
  colorCode?: Color;
  stock?: number;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    media?: unknown;
    hotspot?: unknown;
    crop?: unknown;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  _type: "colorVariant";
  _key: string;
}

interface Review {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  _key: string;
  rating?: number;
}

const ProductData = ({ product }: { product: Product }) => {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [liked, setLiked] = useState<boolean>(false);
  const [addingToWishlist, setAddingToWishlist] = useState<boolean>(false);

  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
  const { user } = useUser();

  const addItem = useCartStore((state) => state.addItem);
  //const items = useCartStore((state) => state.items);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const selectedSize = selectedVariants["Size"];
  const selectedColor = selectedVariants["Color"];

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    return product.variants?.find((variantRef) => {
      const variant = variantRef as unknown as ProductVariant;
      return variant.size === selectedSize;
    }) as unknown as ProductVariant;
  }, [product.variants, selectedSize]);

  // Update quantity if item exists in cart
  useEffect(() => {
    if (selectedSize && selectedColor && selectedVariant) {
      const currentQuantity = getItemQuantity(
        product._id || "",
        selectedVariant._id,
        selectedColor,
      );
      if (currentQuantity > 0) {
        setQuantity(currentQuantity);
      } else {
        setQuantity(1);
      }
    }
  }, [
    selectedSize,
    selectedColor,
    getItemQuantity,
    product._id,
    selectedVariant,
  ]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected variant not found");
      return;
    }

    const colorVariant = selectedVariant.colorVariants?.find(
      (cv) => cv.color === selectedColor,
    );

    if (!colorVariant) {
      toast.error("Selected color variant not found");
      return;
    }

    // Construct image URL for the selected variant
    const imageUrl =
      (colorVariant.images?.[0] as any)?.url ||
      (product.images?.primary as any)?.url;

    const result = addItem(
      product,
      selectedVariant,
      selectedColor,
      quantity,
      imageUrl,
    );

    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart");
      return;
    }

    toast.success("Product added to cart");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected variant not found");
      return;
    }

    const colorVariant = selectedVariant.colorVariants?.find(
      (cv) => cv.color === selectedColor,
    );

    if (!colorVariant) {
      toast.error("Selected color variant not found");
      return;
    }

    // Construct image URL for the selected variant
    const imageUrl =
      (colorVariant.images?.[0] as any)?.url ||
      (product.images?.primary as any)?.url;

    const result = addItem(
      product,
      selectedVariant,
      selectedColor,
      quantity,
      imageUrl,
    );

    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart");
      return;
    }

    // Navigate to checkout after successfully adding to cart
    router.push("/checkout");
  };

  const handleAddToWishList = async () => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    setAddingToWishlist(true);

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected variant not found");
      return;
    }

    const colorVariant = selectedVariant.colorVariants?.find(
      (cv) => cv.color === selectedColor,
    );

    if (!colorVariant) {
      toast.error("Selected color variant not found");
      return;
    }

    // Construct image URL for the selected variant
    const imageUrl =
      (colorVariant.images?.[0] as any)?.url ||
      (product.images?.primary as any)?.url;

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          selectedVariant,
          selectedColor,
          quantity,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to wishlist");
      }

      setLiked(true);
      toast.success("Product added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      toast.error("Error adding product to wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Check if all required variants are selected
  const isVariantSelected = useMemo(() => {
    const selectedSize = selectedVariants["Size"];
    const selectedColor = selectedVariants["Color"];
    return Boolean(selectedSize && selectedColor);
  }, [selectedVariants]);

  // Get selected variant stock
  const selectedVariantStock = useMemo(() => {
    if (!selectedSize || !selectedColor) {
      return 0;
    }

    if (!selectedVariant) {
      return 0;
    }

    const selectedColorVariant = selectedVariant.colorVariants?.find(
      (cv: ColorVariant) => cv.color === selectedColor,
    );

    return selectedColorVariant?.stock || 0;
  }, [selectedVariants, product.variants]);

  // Get selected variant prices
  const selectedVariantPrices = useMemo(() => {
    const selectedSize = selectedVariants["Size"];

    if (!selectedSize) {
      // Return first variant's prices as default
      const firstVariant = product.variants?.[0] as unknown as ProductVariant;
      return {
        price: firstVariant?.price ?? 0,
        compareAtPrice: firstVariant?.compareAtPrice,
      };
    }

    const selectedVariant = product.variants?.find((variantRef) => {
      const variant = variantRef as unknown as ProductVariant;
      return variant.size === selectedSize;
    }) as unknown as ProductVariant;

    if (!selectedVariant) {
      return {
        price: 0,
        compareAtPrice: undefined,
      };
    }

    return {
      price: selectedVariant.price ?? 0,
      compareAtPrice: selectedVariant.compareAtPrice,
    };
  }, [selectedVariants, product.variants]);

  // Get selected variant images
  const selectedVariantImages = useMemo(() => {
    const selectedSize = selectedVariants["Size"];
    const selectedColor = selectedVariants["Color"];

    if (!selectedSize || !selectedColor) {
      return undefined;
    }

    const selectedVariant = product.variants?.find((variantRef) => {
      const variant = variantRef as unknown as ProductVariant;
      return variant.size === selectedSize;
    }) as unknown as ProductVariant;

    if (!selectedVariant) {
      return undefined;
    }

    const selectedColorVariant = selectedVariant.colorVariants?.find(
      (cv: ColorVariant) => cv.color === selectedColor,
    );

    return selectedColorVariant?.images;
  }, [selectedVariants, product.variants]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!product.reviews?.length) return 0;
    const total = product.reviews.reduce((sum, review) => {
      const reviewData = review as unknown as Review;
      return sum + (reviewData.rating || 0);
    }, 0);
    return total / product.reviews.length;
  }, [product.reviews]);

  if (!product) {
    return (
      <Container>
        <p>Product not found</p>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Image Column */}
          <ProductMedia
            media={product.images}
            variantImages={selectedVariantImages}
          />

          {/* Details Column */}
          <div className="flex flex-col gap-4">
            <h1 className="capitalize text-2xl lg:text-4xl ">{product.name}</h1>
            {/* Ratings */}
            <span
              className="flex gap-2 items-center 
            "
            >
              <Star fill="#f5c422" className="text-yellow-400" />
              <p className="font-normal text-xl">{averageRating.toFixed(1)}</p>
              <p className="font-normal text-xl">
                ({product.reviews?.length || 0} Reviews)
              </p>
            </span>
            {/* Price */}
            <div className="inline-flex justify-between items-center w-[20%]">
              <CurrencyFormat
                value={selectedVariantPrices.price}
                className="font-bold text-yellow-600 text-left text-2xl"
              />
              {selectedVariantPrices.compareAtPrice && (
                <CurrencyFormat
                  value={selectedVariantPrices.compareAtPrice}
                  className="line-through text-xl text-slate-500 ml-4"
                />
              )}
            </div>
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <div className="text-lg text-gray-700 font-normal">
                {product.description ? (
                  typeof product.description === "string" ? (
                    product.description
                  ) : (
                    <PortableText value={product.description} />
                  )
                ) : (
                  "No description available"
                )}
              </div>
            </div>

            {/* Product Variants */}
            <ProductVariants
              product={product}
              selectedVariants={selectedVariants}
              setSelectedVariants={setSelectedVariants}
            />

            {/* Stock Information */}
            {(() => {
              if (!isVariantSelected) {
                return null;
              }

              const isLowStock =
                selectedVariantStock > 0 && selectedVariantStock < 5;

              return (
                <div className="-mt-8">
                  {!isLowStock ? (
                    <p className="text-gray-700">
                      Stock Available:{" "}
                      <span className="font-medium">
                        {selectedVariantStock}
                      </span>
                    </p>
                  ) : (
                    <p className="text-yellow-600 font-medium mt-1">
                      Low Stock - Only {selectedVariantStock} left!
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Size Guide */}
            <div className="capitalize underline cursor-pointer mb-2 text-lg">
              <p>View Size Guide</p>
            </div>

            <div className="w-full flex flex-wrap lg:flex-nowrap gap-4 lg:justify-between items-center mt-8  ">
              <NumberInput
                quantity={quantity}
                setQuantity={setQuantity}
                max={selectedVariantStock}
              />

              {/* Add to Cart Button */}
              <div className="flex gap-4 mt-2 items-center w-full">
                <CustomButton
                  size="default"
                  name="Add Cart"
                  primaryColor="white"
                  secondColor="#eab308"
                  outlineColor="#eab308"
                  disabled={!isVariantSelected || selectedVariantStock === 0}
                  handleClick={handleAddToCart}
                />
                <CustomButton
                  size="default"
                  name="Buy Now"
                  primaryColor="#eab308"
                  secondColor="white"
                  outlineColor="#eab308"
                  disabled={!isVariantSelected || selectedVariantStock === 0}
                  handleClick={handleBuyNow}
                />
                {/* Wishlist Heart */}
                {addingToWishlist ? (
                  <Loader2 className=" w-5 h-5  animate-spin text-yellow-500" />
                ) : (
                  <Heart
                    className={cn(
                      "text-yellow-400  cursor-pointer h-8 w-8",
                      liked && "fill-yellow-400",
                    )}
                    onClick={handleAddToWishList}
                  />
                )}
              </div>
            </div>
            <Separator className="mt-6" />
            <div>
              <p>
                SKU:
                {selectedVariant?.sku || "Select size and color to see SKU"}
              </p>
            </div>
          </div>
        </div>
      </Container>
      <ProductInfo product={product} />

      <FeaturedProducts />

      <Services />
    </>
  );
};

export default ProductData;
