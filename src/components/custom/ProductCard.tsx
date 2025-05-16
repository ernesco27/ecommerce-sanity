import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Eye, HeartIcon, Share2, Star } from "lucide-react";
import { m } from "framer-motion";
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
    item.salesPrice && item.price
      ? ((Number(item.price) - Number(item.salesPrice)) / Number(item.price)) *
        100
      : 0;

  // Calculate average rating
  const averageRating =
    item.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) ?? 0;
  const reviewCount = item.reviews?.length ?? 0;
  const rating = reviewCount > 0 ? averageRating / reviewCount : 0;

  return (
    <Card className="w-[400px] mb-8 relative">
      {item.salesPrice && item.price && (
        <Badge
          variant="default"
          className="absolute top-4 left-2 z-10 text-lg bg-white text-green-600 font-semibold"
        >
          {discount.toFixed(0)}% off
        </Badge>
      )}

      <CardHeader className="group/image relative h-[350px] overflow-hidden p-0">
        <Image
          src={item.images?.[0]?.urls?.[0] ?? "/placeholder.jpg"}
          alt={item.images?.[0]?.altText?.[0] ?? item.name ?? "Product image"}
          width={400}
          height={350}
          className="absolute inset-0 object-cover duration-300 ease-linear group-hover/image:translate-x-full"
        />
        <Image
          src={
            item.images?.[0]?.urls?.[1] ??
            item.images?.[0]?.urls?.[0] ??
            "/placeholder.jpg"
          }
          alt={item.images?.[1]?.altText?.[0] ?? item.name ?? "Product image"}
          width={400}
          height={350}
          className="absolute inset-0 object-cover duration-300 ease-linear -translate-x-full group-hover/image:translate-x-0"
        />
        <m.div
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
          <div className="flex flex-col gap-2">
            <Tooltip title="Quick View" placement="left-start" arrow>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item._id}`)}
                className="hover:bg-primary-200"
              >
                <Eye />
              </Button>
            </Tooltip>
            <Tooltip title="Add To Wishlist" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-primary-200"
              >
                <HeartIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share" arrow placement="left-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/products/${item.slug ?? ""}`)}
                className="hover:bg-primary-200"
              >
                <Share2 />
              </Button>
            </Tooltip>
          </div>
        </m.div>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <div className="flex justify-between items-center mt-2 w-full">
          <p className="text-lg font-normal text-gray-400">
            {item.category?.title ?? "Uncategorized"}
          </p>
          <span className="text-primary-400 flex items-center gap-1">
            <Star className="w-5 h-5 fill-primary-400" />
            <p className="text-lg font-semibold text-black">
              {rating.toFixed(1)}
            </p>
          </span>
        </div>
        <h5
          className="capitalize cursor-pointer text-xl lg:text-xl mt-2"
          onClick={() => router.push(`/products/${item._id}`)}
        >
          {item.name && item.name.length > 28
            ? `${item.name.substring(0, 28)}...`
            : item.name}
        </h5>

        <div className="inline-flex justify-center gap-4 items-center">
          {item.salesPrice ? (
            <div className="flex flex-wrap gap-20">
              <CurrencyFormat
                value={Number(item.salesPrice)}
                className="font-bold text-primary-600 text-left w-20 text-lg lg:text-xl"
              />
              <CurrencyFormat
                value={Number(item.price)}
                className="line-through text-lg lg:text-xl text-slate-600"
              />
            </div>
          ) : (
            <CurrencyFormat
              value={Number(item.price)}
              className="font-bold text-primary-600 text-left w-20 text-lg lg:text-xl"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="lg"
          className="w-full text-lg"
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
