"use client";

import Container from "@/components/custom/Container";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import "./style.css";

import {
  Calendar,
  CreditCard,
  Headset,
  LockKeyhole,
  Truck,
} from "lucide-react";
import Reveal from "@/components/custom/Reveal";

const Services = () => {
  return (
    <Reveal width="100%">
      <section className="py-10">
        <Container>
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
                slidesPerView: 5,
                spaceBetween: 40,
              },
            }}
            spaceBetween={50}
            //slidesPerView={5}
            navigation={false}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            className="shadow-xl w-full flex items-center justify-center border border-gray-200 rounded-md px-20 py-10 "
          >
            <SwiperSlide className="relative py-10">
              <div className="flex-center gap-4 md:after:h-10 md:after:w-[2px] lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200 ">
                <Headset className="text-primary-500 h-10 w-10 " />
                <div className="flex flex-col gap-1">
                  <h6 className="uppercase text-base">24/7</h6>
                  <span className="text-sm">Customer Service</span>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="relative py-10">
              <div className="flex items-center justify-center gap-4 lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200 ">
                <CreditCard className="text-primary-500 h-10 w-10 " />
                <div className="flex flex-col gap-1">
                  <h6 className="uppercase text-base ">Accepted Payments</h6>
                  <span className="text-sm">Cards / MoMo</span>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="relative py-10">
              <div className="flex items-center justify-center gap-4 lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200 ">
                <LockKeyhole className="text-primary-500 h-10 w-10 " />
                <div className="flex flex-col gap-1">
                  <h6 className="uppercase text-base ">Secured Payment</h6>
                  <span className="text-sm">100% Secured</span>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="relative py-10">
              <div className="flex items-center justify-center gap-4 lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200 ">
                <Truck className="text-primary-500 h-10 w-10 " />
                <div className="flex flex-col gap-1">
                  <h6 className="uppercase text-base">Free Shipping</h6>
                  <span className="text-sm">Orders Over GHC1000.00</span>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="relative py-10">
              <div className="flex items-center justify-center gap-4 lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200 ">
                <Calendar className="text-primary-500 h-10 w-10 " />
                <div className="flex flex-col gap-1">
                  <h6 className="uppercase text-base">Product Returns</h6>
                  <span className="text-sm">3 Days Guaranteed</span>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </Container>
      </section>
    </Reveal>
  );
};

export default Services;
