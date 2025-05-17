"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/custom/Container";
import CustomButton from "@/components/custom/CustomButton";

const CollectionCta = () => {
  return (
    <section className="py-10  overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="h-[250px] lg:h-[350px] xl:h-[350px] rounded-md bg-[url('/assets/cols-man.jpg')] bg-cover   bg-no-repeat bg-top md:bg-[url('/assets/cols-man2.jpg')] lg:bg-[url('/assets/cols-man2.jpg')] px-8  "
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
                  Men's Latest
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
                name="Shop Now"
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
            className="h-[250px] lg:h-[350px] md:h-[350px] xl:h-[350px]  rounded-md bg-[url('/assets/cols-lady2.jpg')] bg-cover bg-no-repeat bg-top md:bg-[url('/assets/cols-lady.jpg')] lg:bg-[url('/assets/cols-lady.jpg')] px-8"
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
                name="Shop Now"
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
