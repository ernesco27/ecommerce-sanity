"use client";

import React from "react";
import Container from "@/components/custom/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useSWR from "swr";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Row from "@/components/custom/Row";

import { Skeleton } from "@/components/ui/skeleton";
import Heading from "@/components/custom/Heading";

import { Banner } from "../../../../sanity.types";

const Categories = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<Banner[]>("/api/banners?type=category", fetcher);

  if (isLoading)
    return (
      <div className="w-full overflow-hidden">
        <Skeleton className="w-full h-[700px]" />
      </div>
    );

  if (error) return null;

  if (!banners || banners.length === 0) return null;

  const animation = {
    hide: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  };

  const router = useRouter();

  const handleClick = (link: string) => {
    router.push(`/${link}`);
  };

  return (
    <section className="py-10">
      <Container>
        <Row className="mb-10">
          <Heading name="shop by category" />
        </Row>
        {isLoading && (
          <div className=" ">
            <Skeleton className="w-full h-[450px]" />
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
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          navigation={false}
          pagination={true}
          modules={[Autoplay, Navigation, Pagination]}
          className=" w-full flex items-center justify-center  rounded-md px-20 py-10 "
        >
          {banners?.map((banner: Banner, index: number) => (
            <SwiperSlide
              key={banner._id}
              className="relative [&>button]:block !transition  duration-300 ease-in-out hover:scale-105 cursor-pointer rounded-md "
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
                height: "600px",
                width: "auto",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              <div
                className="absolute bg-white rounded-lg p-4 bottom-10 shadow-xl cursor-pointer hover:bg-yellow-600 hover:text-white drop-shadow-xl duration-200 ease-linear capitalize"
                onClick={() => handleClick(banner.link || "")}
              >
                <motion.h6
                  initial={animation.hide}
                  whileInView={animation.show}
                  transition={{
                    delay: 0.1 + index / 6,
                  }}
                >
                  {banner.title}
                </motion.h6>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default Categories;
