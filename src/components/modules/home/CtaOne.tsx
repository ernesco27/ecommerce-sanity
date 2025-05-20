"use client";

import React from "react";
import { delay, motion } from "framer-motion";
import useSWR from "swr";

import { useRouter } from "next/navigation";
import { Banner } from "../../../../sanity.types";

type BannerResponse = Banner & {
  imageUrl: string;
};

const CtaOne = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const router = useRouter();

  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<BannerResponse[]>("/api/banners?type=promo", fetcher);

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <motion.section
      initial={{
        x: -100,
        opacity: 0,
      }}
      whileInView={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
        type: "tween",
        delay: 0.2,
      }}
      className="my-4 hover:cursor-pointer "
    >
      <div
        className={`w-full h-[130px] lg:h-[250px] lg:bg-contain lg:bg-repeat bg-cover bg-no-repeat bg-top`}
        style={{
          backgroundImage: `url(${banners?.[0]?.imageUrl})`,
        }}
        onClick={() => handleClick("link")}
      ></div>
    </motion.section>
  );
};

export default CtaOne;
