"use client";

import Container from "@/components/custom/Container";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import Services from "@/components/modules/home/Services";
import React from "react";
import { Banner } from "../../../../../sanity.types";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useCategories } from "@/store/categoriesStore";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
type BannerResponse = Banner & {
  imageUrl: string;
  link: string;
};

const page = () => {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<BannerResponse[]>("/api/banners?type=promo", fetcher);

  const { categories } = useCategories();

  const banner4 = banners?.[8];

  return (
    <div>
      <div
        className="bg-gray-300 h-[300px] w-full"
        style={{
          backgroundImage: `url(${banner4?.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/50 h-full w-full flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold bg-white rounded-sm text-yellow-600 ">
            {banner4?.title}
          </h1>
          <p className="text-black text-wrap font-semibold text-center text-lg">
            {banner4?.subTitle}
          </p>
          <Button
            onClick={() => router.push(banner4?.link || "")}
            variant="outline"
            className=" text-black hover:bg-yellow-700 mt-4"
          >
            {banner4?.buttonText}
          </Button>
        </div>
      </div>
      <Container>
        <Services />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
          {categories?.map((category) => (
            <div
              key={category._id}
              className="p-4 rounded-lg h-[500px] flex flex-col gap-4"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Badge className="bg-white text-black mt-4">
                {category.productCount
                  ? `${category.productCount}+ items`
                  : "N/A items"}
              </Badge>
              <h2
                className="text-2xl font-bold hover:text-yellow-800 cursor-pointer"
                onClick={() => router.push(`/categories/${category.slug}`)}
              >
                {category.title}
              </h2>
              <p className="text-gray-600  w-[60%] text-wrap">
                {category.description || ""}
              </p>
              {category?.subcategories?.map((subcategory) => (
                <ul key={subcategory._id}>
                  <Link href={`/categories/${subcategory.slug?.current}`}>
                    <li className="hover:text-yellow-600">
                      {subcategory.name}
                    </li>
                  </Link>
                </ul>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <FeaturedProducts />
    </div>
  );
};

export default page;
