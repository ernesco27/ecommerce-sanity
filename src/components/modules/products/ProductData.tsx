"use client";

import Container from "@/components/custom/Container";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import CustomButton from "@/components/custom/CustomButton";

//import ProductVariants from "@/components/custom/ProductVariants";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
//import { Product, ProductItem, ProductItemVariantValue } from "@/types";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";

//import { cn, findSelectedItemDetails } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

//import { useProduct } from "./ProductContext";
import { Input } from "@/components/ui/input";

import NumberInput from "@/components/custom/NumberInput";
//import { useCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";
import { Product, ProductVariant, Color } from "../../../../sanity.types";
import ProductMedia from "./ProductMedia";
import Loading from "./Loading";
import ProductVariants from "./ProductVariants";
import { cn } from "@/lib/utils";

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

// interface Tag {
//   id?: string;
//   name: string;
// }

const ProductData = ({ product }: { product: Product }) => {
  // All hooks at the top in consistent order
  //const { productData } = useProduct();
  // const resolvedParams = React.use(params);
  // const { productId } = resolvedParams;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [liked, setLiked] = useState<boolean>(false);
  //   const [isInitialized, setIsInitialized] = useState(false);

  //   const addItem = useCartStore((state) => state.addItem);

  //   // --- Data Processing (Handles Decimals and ProductItems) ---
  //   const product = useMemo(() => {
  //     if (!productData) return null;

  //     return {
  //       ...productData,
  //       price: new Prisma.Decimal(productData.price ?? 0),
  //       salesPrice: productData.salesPrice
  //         ? new Prisma.Decimal(productData.salesPrice)
  //         : null,
  //       variants: productData.variants?.map((variant: any) => ({
  //         ...variant,
  //         values: variant.values?.map((value: any) => ({ ...value })),
  //       })),
  //       productItems: productData.productItems?.map((item: any) => ({
  //         ...item,
  //         price: new Prisma.Decimal(item.price ?? 0),
  //       })),
  //     };
  //   }, [productData]);

  //   // --- Find Selected Item Details ---
  //   const selectedItemDetails = useMemo(
  //     () => (product ? findSelectedItemDetails(product, selectedVariants) : null),
  //     [product, selectedVariants],
  //   );

  //   const availableQuantity = useMemo(() => {
  //     if (!selectedItemDetails) return 0;
  //     return selectedItemDetails.quantity;
  //   }, [selectedItemDetails]);

  //   // --- Calculate Display Values ---
  //   const displayPrice =
  //     selectedItemDetails?.price ?? product?.price ?? new Prisma.Decimal(0);
  //   // Use product base sales price only if NO specific item is selected, otherwise variant price IS the price
  //   const displaySalesPrice = selectedItemDetails ? null : product?.salesPrice;
  //   const originalPriceForStrikeThrough =
  //     selectedItemDetails?.price &&
  //     (selectedItemDetails.price as Prisma.Decimal).lt(
  //       product?.price ?? new Prisma.Decimal(0),
  //     )
  //       ? product?.price // Show base price if selected item price is lower
  //       : displaySalesPrice?.lt(product?.price ?? new Prisma.Decimal(0))
  //       ? product?.price // Show base price if base sales price is lower
  //       : null; // No strikethrough needed

  //   const selectedQuantity = selectedItemDetails?.quantity ?? 0;
  //   const isSelectedVariantOutOfStock =
  //     selectedQuantity <= 0 && selectedItemDetails !== null;

  //   // Convert to numbers for CurrencyFormat
  //   const priceAsNumber = displayPrice.toNumber();
  //   const salesPriceAsNumber = displaySalesPrice?.toNumber(); // Will be null if item selected
  //   const originalPriceAsNumberForStrike =
  //     originalPriceForStrikeThrough?.toNumber();

  //   // --- Initialization Effect ---
  //   useEffect(() => {
  //     if (
  //       product &&
  //       product.variants &&
  //       product.variants.length > 0 &&
  //       !isInitialized
  //     ) {
  //       let firstAvailableCombination: Record<string, string> | null = null;
  //       const firstItemInStock = product.productItems?.find(
  //         (item: ProductItemType) => item.quantity > 0,
  //       );

  //       if (firstItemInStock) {
  //         firstAvailableCombination = {};
  //         firstItemInStock.variantValues.forEach(
  //           (vv: ProductItemType["variantValues"][0]) => {
  //             firstAvailableCombination![vv.variant.name] = vv.value;
  //           },
  //         );
  //       } else {
  //         firstAvailableCombination = product.variants.reduce(
  //           (acc: Record<string, string>, variant: Variant) => {
  //             const firstValue = variant.values?.[0]?.value;
  //             if (variant.name && firstValue) {
  //               acc[variant.name] = firstValue;
  //             }
  //             return acc;
  //           },
  //           {},
  //         );
  //       }

  //       if (
  //         firstAvailableCombination &&
  //         Object.keys(firstAvailableCombination).length > 0
  //       ) {
  //         setSelectedVariants(firstAvailableCombination);
  //       }
  //       setIsInitialized(true);
  //     }
  //   }, [product, isInitialized]);

  // Check if all required variants are selected
  const isVariantSelected = useMemo(() => {
    const selectedSize = selectedVariants["Size"];
    const selectedColor = selectedVariants["Color"];
    return Boolean(selectedSize && selectedColor);
  }, [selectedVariants]);

  const selectedSize = selectedVariants["Size"];
  const selectedColor = selectedVariants["Color"];

  const selectedVariant = product.variants?.find((variantRef) => {
    const variant = variantRef as unknown as ProductVariant;
    return variant.size === selectedSize;
  }) as unknown as ProductVariant;

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

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariants]);

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

  const handleAddToCart = () => {
    toast.success("Product added to cart", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleAddToWishList = () => {
    setLiked(!liked);

    if (!liked) {
      toast.success("Product added to wishlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Product removed from Wishlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // --- Render Logic ---
  if (!product) {
    return <Loading />;
  }

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
              <p className="text-lg text-gray-700 font-normal">
                {product.description || "No description available"}
              </p>
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
                  name="Add to Cart"
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
                />
                {/* Wishlist Heart */}
                <Heart
                  className={cn(
                    "text-yellow-400  cursor-pointer h-8 w-8",
                    liked && "fill-yellow-400",
                  )}
                  onClick={handleAddToWishList}
                />
              </div>
            </div>
            <Separator className="mt-6" />
            <div>
              <p>
                SKU:
                {selectedVariant?.sku || "Select size and color to see SKU"}
              </p>
              <span></span>
            </div>
          </div>
        </div>
      </Container>
      {/* <ProductInfo product={product} />
      <FeaturedProducts />
      <Payments /> */}
    </>
  );
};

export default ProductData;
