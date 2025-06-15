"use client";

import React from "react";
import { motion } from "framer-motion";
import useSWR from "swr";

import { useRouter } from "next/navigation";
import Container from "@/components/custom/Container";
import Countdown from "react-countdown";

import Image from "next/image";
import Row from "@/components/custom/Row";
import Heading from "@/components/custom/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";

import { Skeleton } from "@/components/ui/skeleton";
import ProductCardTwo from "@/components/custom/ProductCardTwo";
import { ProductsQueryResult } from "../../../../sanity.types";

const Deals = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const router = useRouter();

  const {
    data: products,
    error,
    isLoading,
  } = useSWR<ProductsQueryResult>("/api/products?limit=10", fetcher);

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 100,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="py-10 "
    >
      <Container>
        <Row className="mb-10">
          <Heading name="Today Deals" />
          <Countdown date={Date.now() + 1000000} className="text-2xl" />
        </Row>
        <h3 className="py-2 font-normal text-lg lg:text-2xl">
          Deals of the Day
        </h3>
        {isLoading && (
          <div className=" ">
            <Skeleton className="w-full h-[350px]" />
          </div>
        )}
        <Swiper
          breakpoints={{
            360: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            575: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          navigation={false}
          pagination={true}
          modules={[Autoplay, Navigation, Pagination]}
          className=" w-full flex-center rounded-md"
        >
          {products?.map((item) => (
            <SwiperSlide
              key={item._id}
              className="relative [&>button]:block  cursor-pointer rounded-md mb-4"
            >
              <ProductCardTwo item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </motion.section>
  );
};

export default Deals;
