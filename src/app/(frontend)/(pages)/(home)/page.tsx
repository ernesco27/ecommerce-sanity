import Categories from "@/components/modules/home/Categories";
import HomeSlide from "@/components/modules/home/HomeSlide";
import Services from "@/components/modules/home/Services";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";

import React from "react";
import CtaOne from "@/components/modules/home/CtaOne";
import Deals from "@/components/modules/home/Deals";
import CollectionCta from "@/components/modules/home/CollectionCta";
const Home = () => {
  return (
    <>
      <HomeSlide />
      <Services />
      <Categories />
      <FeaturedProducts />
      <CtaOne />
      <Deals />
      <CollectionCta />
    </>
  );
};

export default Home;
