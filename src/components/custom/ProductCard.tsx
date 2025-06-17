import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Eye, HeartIcon, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "../ui/button";
import CurrencyFormat from "./CurrencyFormat";
import type { ProductsQueryResult } from "../../../sanity.types";

type ProductCardProps = {
  item: ProductsQueryResult[0];
};

const ProductCard = ({ item }: ProductCardProps) => {
  const router = useRouter();

  // Calculate min and max prices from variants
  const prices =
    item.variants?.map((variant) => Number(variant.price) || 0) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const discount =
    maxPrice && minPrice ? ((maxPrice - minPrice) / maxPrice) * 100 : 0;

  // Calculate average rating
  const averageRating =
    item.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) ?? 0;
  const reviewCount = item.reviews?.length ?? 0;
  const rating = reviewCount > 0 ? averageRating / reviewCount : 0;

  return (
    <Card className="w-[340px] lg:w-[380px] mb-8 relative ">
      {maxPrice > minPrice && (
        <Badge
          variant="default"
          className="absolute top-4 left-2 z-10 text-lg bg-white text-green-600 font-semibold"
        >
          {discount.toFixed(0)}% off
        </Badge>
      )}

      <CardHeader className="group/image relative h-[350px] overflow-hidden ">
        <Image
          src={item.images?.gallery?.[0]?.url ?? "/placeholder.jpg"}
          alt={item.images?.gallery?.[0]?.alt ?? item.name ?? "Product image"}
          width="400"
          height="350"
          className="absolute inset-0 object-cover duration-300 ease-linear group-hover/image:translate-x-full "
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
          width="400"
          height="350"
          className="absolute inset-0 object-cover duration-300 ease-linear -translate-x-full group-hover/image:translate-x-0"
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
          className="hidden absolute top-4 right-4 flex-col gap-4  group-hover/image:flex duration-300 ease-in"
        >
          <div className="flex flex-col gap-2">
            <Tooltip title="Quick View" placement="left-start" arrow>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug}`)}
                className="hover:bg-primary-100 cursor-pointer dark:bg-primary-100 text-dark400_light500"
              >
                <Eye />
              </Button>
            </Tooltip>
            <Tooltip title="Add To Wishlist" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-primary-100 cursor-pointer dark:bg-primary-100 text-dark400_light500"
              >
                <HeartIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-primary-100 cursor-pointer dark:bg-primary-100 text-dark400_light500"
              >
                <Share2 />
              </Button>
            </Tooltip>
          </div>
        </motion.div>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <div className="flex justify-between items-center mt-2 w-full">
          <p className="text-lg font-normal text-gray-400">
            {item.category?.title ?? "Uncategorized"}
          </p>
          {rating > 0 && (
            <span className="text-primary-500 flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary-500" />
              <p className="paragraph-medium">{rating.toFixed(1)}</p>
            </span>
          )}
        </div>
        <h5
          className="capitalize cursor-pointer text-xl lg:text-xl mt-2 "
          onClick={() => router.push(`/products/${item.slug}`)}
        >
          {item.name && item.name.length > 28
            ? `${item.name.substring(0, 28)}...`
            : item.name}
        </h5>

        <div className="w-full">
          {maxPrice > minPrice ? (
            <div className="flex flex-wrap justify-between">
              <CurrencyFormat
                value={minPrice}
                className="font-bold text-primary-500  text-left w-20 text-lg lg:text-xl"
              />
              <CurrencyFormat
                value={maxPrice}
                className="line-through text-lg lg:text-xl text-slate-600 dark:text-primary-100/50"
              />
            </div>
          ) : (
            <CurrencyFormat
              value={maxPrice || 0}
              className="font-bold text-primary-500 text-left w-20 text-lg lg:text-xl"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="lg"
          className="w-full text-lg bg-slate-100 text-black hover:bg-slate-200 mb-4 cursor-pointer transition-all duration-300 ease-in-out dark:bg-primary-100 "
          onClick={() => router.push(`/products/${item.slug}`)}
        >
          Shop Now
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
