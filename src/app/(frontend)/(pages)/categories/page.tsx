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
type BannerResponse = Banner & {
  imageUrl: string;
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

  const banner1 = banners?.[7];
  const banner2 = banners?.[5];
  const banner3 = banners?.[6];

  const category1 = categories?.[0];
  const category2 = categories?.[1];
  const category3 = categories?.[2];

  return (
    <div>
      <div className="bg-gray-300 h-[500px] w-full">banner</div>
      <Container>
        <Services />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
          <div
            className="p-4 rounded-lg h-[500px] flex flex-col gap-4"
            style={{
              backgroundImage: `url(${banner1?.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Badge className="bg-white text-black mt-4">
              {category2?.productCount
                ? `${category2.productCount}+ items`
                : "N/A items"}
            </Badge>

            <h2 className="text-2xl font-bold hover:text-yellow-800 cursor-pointer">
              {category2?.title}
            </h2>
            <p className="text-gray-600  w-[60%] text-wrap">
              {category2?.description ||
                "Test description Test description Test description"}
            </p>
            {category2?.subcategories?.map((subcategory) => (
              <ul key={subcategory._id}>
                <Link href={`/categories/${subcategory.slug?.current}`}>
                  <li className="hover:text-yellow-600">{subcategory.name}</li>
                </Link>
              </ul>
            ))}
          </div>
          <div
            className="p-4 rounded-lg h-[500px] flex flex-col gap-4"
            style={{
              backgroundImage: `url(${banner2?.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Badge className="bg-white text-black mt-4">
              {category1?.productCount
                ? `${category1.productCount}+ items`
                : "N/A items"}
            </Badge>

            <h2 className="text-2xl font-bold hover:text-yellow-800 cursor-pointer">
              {category1?.title}
            </h2>
            <p className="text-gray-600  w-[60%] text-wrap">
              {category1?.description ||
                "Test description Test description Test description"}
            </p>
            {category1?.subcategories?.map((subcategory) => (
              <ul key={subcategory._id}>
                <Link href={`/categories/${subcategory.slug?.current}`}>
                  <li className="hover:text-yellow-600">{subcategory.name}</li>
                </Link>
              </ul>
            ))}
          </div>
          <div
            className="p-4 rounded-lg h-[500px] flex flex-col gap-4"
            style={{
              backgroundImage: `url(${banner3?.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Badge className="bg-white text-black mt-4">
              {category3?.productCount
                ? `${category3.productCount}+ items`
                : "N/A items"}
            </Badge>

            <h2 className="text-2xl font-bold hover:text-yellow-800 cursor-pointer">
              {category3?.title}
            </h2>
            <p className="text-gray-600  w-[60%] text-wrap">
              {category3?.description ||
                "Test description Test description Test description"}
            </p>
            {category3?.subcategories?.map((subcategory) => (
              <ul key={subcategory._id}>
                <Link href={`/categories/${subcategory.slug?.current}`}>
                  <li className="hover:text-yellow-600">{subcategory.name}</li>
                </Link>
              </ul>
            ))}
          </div>
        </div>
      </Container>
      <FeaturedProducts />
    </div>
  );
};

export default page;
