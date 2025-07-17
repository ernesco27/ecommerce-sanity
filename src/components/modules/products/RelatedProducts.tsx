"use client";

import React from "react";
import Container from "@/components/custom/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/custom/ProductCard";
import Row from "@/components/custom/Row";
import Heading from "@/components/custom/Heading";
import type { Product, RelatedProduct } from "../../../../sanity.types";
import Reveal from "@/components/custom/Reveal";
import Link from "next/link";
import logger from "@/lib/logger";

const RelatedProducts = ({ product }: { product: Product }) => {
  logger.info("related:Products", product.relatedProducts);

  return (
    <Reveal>
      <section className="py-10 ">
        <Container>
          <Row className="mb-10 justify-between">
            <Heading name="Related Products" />
            <Link
              href="/products?featured=true"
              className="paragraph-semibold hover:text-primary-500"
            >
              View All
            </Link>
          </Row>

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
            className=" flex items-center justify-center "
          >
            {product?.relatedProducts?.map((item: RelatedProduct) => (
              <SwiperSlide
                key={item._id}
                className="relative [&>button]:block  cursor-pointer rounded-md"
              >
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>
    </Reveal>
  );
};

export default RelatedProducts;
