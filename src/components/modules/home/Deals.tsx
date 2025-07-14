"use client";

import useSWR from "swr";

import { useRouter } from "next/navigation";
import Container from "@/components/custom/Container";
import Countdown from "react-countdown";

import Row from "@/components/custom/Row";
import Heading from "@/components/custom/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";

import { Skeleton } from "@/components/ui/skeleton";
import ProductCardTwo from "@/components/custom/ProductCardTwo";
import { Product } from "../../../../sanity.types";
import Reveal from "@/components/custom/Reveal";
import Link from "next/link";

const Deals = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const router = useRouter();

  const {
    data: products,
    error,
    isLoading,
  } = useSWR<Product[]>("/api/products?deal=true&limit=10", fetcher);

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <Reveal>
      <section className="py-10 ">
        <Container>
          <Row className="mb-10 justify-between ">
            <Heading name="Today Deals" />
            <Countdown date={Date.now() + 1000000} className="text-2xl" />
            <Link
              href="/products?deal=true"
              className="paragraph-semibold hover:text-primary-500"
            >
              View All
            </Link>
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
              1440: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1680: {
                slidesPerView: 6,
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
      </section>
    </Reveal>
  );
};

export default Deals;
