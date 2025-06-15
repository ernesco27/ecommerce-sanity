"use client";

import Container from "@/components/custom/Container";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Banner } from "../../../../sanity.types";
import "../products/style.css";

type BannerResponse = Banner & {
  imageUrl: string;
};

const HomeSlide = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const animation = {
    hide: {
      opacity: 0,
      x: 82,
    },
    show: {
      opacity: 1,
      x: 0,
    },
  };

  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<BannerResponse[]>("/api/banners?type=hero", fetcher);

  if (isLoading)
    return (
      <div className="w-full overflow-hidden">
        <Skeleton className="w-full h-[700px]" />
      </div>
    );

  if (error) return null;

  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full overflow-hidden">
      <Container className="w-full max-w-full px-0">
        <Swiper
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          spaceBetween={0}
          slidesPerView={1}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Navigation, Pagination]}
          className="w-full"
        >
          {banners.map((banner) => (
            <SwiperSlide
              key={banner._id}
              className="relative w-full"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
                height: "700px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: banner.backgroundColor || "black",
              }}
            >
              <div
                className="absolute grid grid-cols-1 place-content-center lg:place-content-start justify-items-center gap-4 capitalize m-auto lg:left-2 top-1/4  w-full lg:w-1/2 p-8"
                style={{ color: banner.textColor || "white" }}
              >
                {banner.subTitle && (
                  <motion.h4
                    initial={animation.hide}
                    whileInView={animation.show}
                    transition={{ delay: 0.4 }}
                    className="text-2xl lg:text-3xl font-light drop-shadow-lg"
                  >
                    {banner.subTitle}
                  </motion.h4>
                )}
                <motion.h1
                  initial={animation.hide}
                  whileInView={animation.show}
                  transition={{ delay: 0.6 }}
                  className="text-4xl lg:text-6xl font-bold text-center lg:text-left drop-shadow-lg"
                >
                  {banner.title}
                </motion.h1>
                {banner.description && (
                  <motion.p
                    initial={animation.hide}
                    whileInView={animation.show}
                    transition={{ delay: 0.8 }}
                    className="text-lg lg:text-xl text-center lg:text-left drop-shadow-lg"
                  >
                    {banner.description}
                  </motion.p>
                )}
                {banner.link && (
                  <motion.div
                    initial={animation.hide}
                    whileInView={animation.show}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="mt-4 text-lg px-8 py-6 bg-white text-black hover:bg-primary-900 hover:text-white transition-colors"
                    >
                      <Link href={banner.link}>
                        {banner.buttonText || "Shop Now"}
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default HomeSlide;
