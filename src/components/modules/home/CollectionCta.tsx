"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/custom/Container";
import CustomButton from "@/components/custom/CustomButton";
import { Banner } from "../../../../sanity.types";
import useSWR from "swr";
import { cn } from "@/lib/utils";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CollectionCta = () => {
  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<Banner[]>("/api/banners?type=promo", fetcher);

  //console.log("banners:", banners);

  const casualBanner = banners?.[1]?.imageUrl;
  const specialtyBanner = banners?.[2]?.imageUrl;

  return (
    <section className="py-10  overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="h-[250px] lg:h-[350px] xl:h-[350px] rounded-md px-8 bg-red-200"
            style={{
              backgroundImage: `url(${casualBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              height: "350px",
            }}
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="flex flex-col gap-4 lg:gap-6 py-4 w-3/4"
            >
              <p className="capitalize text-sm lg:text-lg font-normal">
                {banners?.[1]?.title}
              </p>
              <div className="">
                <span className="block text-2xl lg:text-4xl ">
                  {banners?.[1]?.subTitle}
                </span>
                <span className="block mt-2 lg:mt-6 text-2xl lg:text-4xl">
                  Collection
                </span>
              </div>
              <p className="text-wrap text-sm lg:text-lg font-normal mr-8 leading-tight">
                {banners?.[1]?.description}
              </p>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="mt-4"
            >
              <CustomButton
                name={banners?.[1]?.buttonText || "Shop Now"}
                primaryColor="#eab308"
                secondColor="white"
                outlineColor="#eab308"
              />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="h-[250px] lg:h-[350px] md:h-[350px] xl:h-[350px]  rounded-md px-8"
            style={{
              backgroundImage: `url(${specialtyBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              height: "350px",
            }}
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="flex flex-col gap-4 lg:gap-6 py-4 w-3/4"
            >
              <p className="capitalize text-sm lg:text-lg font-normal">
                Explore the Latest Trends
              </p>
              <div className="">
                <span className="block text-2xl lg:text-4xl ">
                  Women's Latest
                </span>
                <span className="block mt-2 lg:mt-6 text-2xl lg:text-4xl">
                  Collection
                </span>
              </div>
              <p className="text-wrap text-sm lg:text-lg font-normal mr-8 leading-tight">
                From casual to formal, find the perfect outfit for any occasion.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="mt-4"
            >
              <CustomButton
                name={banners?.[2]?.buttonText || "Shop Now"}
                primaryColor="white"
                secondColor="#eab308"
                outlineColor="#eab308"
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default CollectionCta;
