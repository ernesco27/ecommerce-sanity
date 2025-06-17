import React from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, Eye, HeartIcon, Share2, Star } from "lucide-react";
import CurrencyFormat from "./CurrencyFormat";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Tooltip from "@mui/material/Tooltip";
import { ProductsQueryResult } from "../../../sanity.types";

type ProductCardProps = {
  item: ProductsQueryResult[0];
};

const ProductCardTwo = ({ item }: ProductCardProps) => {
  const router = useRouter();

  // Calculate min and max prices from variants
  const prices =
    item.variants?.map((variant) => Number(variant.price) || 0) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Calculate average rating
  const averageRating =
    item.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) ?? 0;
  const reviewCount = item.reviews?.length ?? 0;
  const rating = reviewCount > 0 ? averageRating / reviewCount : 0;

  return (
    <Card className="w-[340px]  lg:w-[380px] max-h-[400px] overflow-hidden grid grid-cols-2 mb-6  gap-0  ">
      <CardHeader className="group/image relative h-[450px] overflow-hidden ">
        <Image
          src={item.images?.gallery?.[0]?.url ?? "/placeholder.jpg"}
          alt={item.images?.gallery?.[0]?.alt ?? item.name ?? "Product image"}
          width="450"
          height="450"
          className="absolute inset-0 object-cover duration-300 ease-linear group-hover/image:translate-x-full h-full w-full"
        />
        <Image
          src={
            item.images?.gallery?.[1]?.url ??
            item.images?.gallery?.[0]?.url ??
            "/placeholder.jpg"
          }
          alt={
            item.images?.gallery?.[1]?.alt ??
            item.images?.gallery?.[0]?.alt ??
            item.name ??
            "Product image"
          }
          width="450"
          height="450"
          className="absolute inset-0 object-cover duration-300 ease-linear -translate-x-full group-hover/image:translate-x-0 h-full w-full"
        />
        <motion.div
          initial={{
            opacity: 0,
            x: 10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: 10,
          }}
          transition={{
            duration: 0.3,
            type: "spring",
          }}
          className="hidden absolute top-4 right-4 flex-col gap-4 group-hover/image:flex duration-300 ease-in"
        >
          <div className="flex flex-col gap-2 ">
            <Tooltip title="Quick View" placement="left-start" arrow>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug}`)}
                className="hover:bg-primary-100 cursor-pointer hover:text-black dark:bg-primary-100 text-dark400_light500"
              >
                <Eye />
              </Button>
            </Tooltip>
            <Tooltip title="Add To Wishlist" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug}`)}
                className="hover:bg-primary-100 cursor-pointer hover:text-black dark:bg-primary-100 text-dark400_light500"
              >
                <HeartIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug}`)}
                className="hover:bg-primary-100 cursor-pointer hover:text-black dark:bg-primary-100 text-dark400_light500"
              >
                <Share2 />
              </Button>
            </Tooltip>
          </div>
        </motion.div>
      </CardHeader>
      <div className="flex flex-col gap-8 items-start pt-4  ">
        <CardContent className="flex flex-col gap-4 text-start py-2">
          <h5 className="capitalize h3-medium">
            {item.name && item.name.length > 30
              ? `${item.name.substring(0, 30)}...`
              : item.name}
          </h5>
          <div className="w-full">
            {maxPrice > minPrice ? (
              <div className="flex-between flex-wrap">
                <CurrencyFormat
                  value={minPrice}
                  className="font-bold text-primary-500 text-left w-20 text-lg lg:text-xl"
                />
                <CurrencyFormat
                  value={maxPrice}
                  className="line-through text-lg lg:text-xl text-slate-600 dark:text-primary-100/50"
                />
              </div>
            ) : (
              <CurrencyFormat
                value={maxPrice}
                className="font-bold text-primary-500 text-left w-20 text-lg lg:text-xl"
              />
            )}
          </div>
          {rating > 0 && (
            <span className="text-primary-500 flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary-500" />
              <p className="paragraph-medium ">{rating.toFixed(1)}</p>
            </span>
          )}
          <p className="text-sm lg:text-lg font-normal">
            {item.description && item.description.length > 40
              ? `${item.description.substring(0, 40)}...`
              : item.description}
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            className="text-lg bg-slate-100 text-black hover:bg-slate-200 transition-all duration-300 ease-in-out cursor-pointer dark:bg-primary-100"
            onClick={() => router.push(`/products/${item.slug}`)}
          >
            Shop Now
            <ArrowRight />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCardTwo;
