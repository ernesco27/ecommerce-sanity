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

  // Calculate average rating
  const averageRating =
    item.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) ?? 0;
  const reviewCount = item.reviews?.length ?? 0;
  const rating = reviewCount > 0 ? averageRating / reviewCount : 0;

  return (
    <Card className="w-[380px] max-h-[400px] overflow-hidden grid grid-cols-2 mb-6  gap-0  ">
      <CardHeader className="group/image relative h-[450px] overflow-hidden bg-red-500 ">
        <Image
          src={item.images?.gallery?.[0]?.url ?? "/placeholder.jpg"}
          alt={item.images?.gallery?.[0]?.alt ?? item.name ?? "Product image"}
          width="450"
          height="450"
          className="absolute inset-0 object-cover duration-300 ease-linear group-hover/image:translate-x-full h-full w-full"
        />
        <Image
          src={item.images?.gallery?.[1]?.url ?? "/placeholder.jpg"}
          alt={item.images?.gallery?.[1]?.alt ?? item.name ?? "Product image"}
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
                onClick={() => router.push(`/products/${item._id}`)}
                className="hover:bg-yellow-200 hover:text-black"
              >
                <Eye />
              </Button>
            </Tooltip>
            <Tooltip title="Add To Wishlist" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item._id}`)}
                className="hover:bg-yellow-200 hover:text-black"
              >
                <HeartIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item._id}`)}
                className="hover:bg-yellow-200 hover:text-black"
              >
                <Share2 />
              </Button>
            </Tooltip>
          </div>
        </motion.div>
      </CardHeader>
      <div className="flex flex-col gap-8 items-start pt-4  ">
        <CardContent className="flex flex-col gap-4 text-start py-2">
          <h5 className="capitalize text-lg">
            {item.name?.substring(0, 30)}...{" "}
          </h5>
          <div className=" w-full">
            {item.pricing?.min ? (
              <div className="flex flex-wrap justify-between">
                <CurrencyFormat
                  value={Number(item.pricing?.min)}
                  className="font-bold text-yellow-600 text-left w-20 text-lg lg:text-xl"
                />
                <CurrencyFormat
                  value={Number(item.pricing?.max)}
                  className="line-through text-lg lg:text-xl text-slate-600"
                />
              </div>
            ) : (
              <CurrencyFormat
                value={Number(item.pricing.max)}
                className="font-bold text-yellow-600 text-left w-20 text-lg lg:text-xl"
              />
            )}
          </div>
          {rating ? (
            <span className="text-yellow-400 flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400" />
              <p className="text-lg font-semibold text-black">
                {rating.toFixed(1)}
              </p>
            </span>
          ) : (
            ""
          )}
          <p className="text-sm lg:text-lg font-normal">
            {item.description?.substring(0, 40)}...
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            className="text-lg bg-yellow-400 text-white transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => router.push(`/products/${item._id}`)}
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
