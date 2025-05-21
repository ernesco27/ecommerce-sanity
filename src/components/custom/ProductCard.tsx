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

  const discount =
    item.pricing?.max && item.pricing?.min
      ? ((Number(item.pricing.max) - Number(item.pricing.min)) /
          Number(item.pricing.max)) *
        100
      : 0;

  // Calculate average rating
  const averageRating =
    item.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) ?? 0;
  const reviewCount = item.reviews?.length ?? 0;
  const rating = reviewCount > 0 ? averageRating / reviewCount : 0;

  return (
    <Card className="w-[380px] mb-8 relative">
      {item.pricing?.max && item.pricing?.min && (
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
            item.images?.gallery?.[1]?.alt ??
            "/placeholder.jpg"
          }
          alt={item.images?.gallery?.[1]?.alt ?? item.name ?? "Product image"}
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
                onClick={() => router.push(`/products/${item._id}`)}
                className="hover:bg-yellow-200"
              >
                <Eye />
              </Button>
            </Tooltip>
            <Tooltip title="Add To Wishlist" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-yellow-200"
              >
                <HeartIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-yellow-200"
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
            {item.subcategories?.[0]?.name ?? "Uncategorized"}
          </p>
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
        </div>
        <h5
          className="capitalize cursor-pointer text-xl lg:text-xl mt-2"
          onClick={() => router.push(`/products/${item._id}`)}
        >
          {item.name && item.name.length > 28
            ? `${item.name.substring(0, 28)}...`
            : item.name}
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
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="lg"
          className="w-full text-lg bg-yellow-400 text-white mb-4 cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => router.push(`/products/${item._id}`)}
        >
          Shop Now
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
