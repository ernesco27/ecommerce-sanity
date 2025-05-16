import Categories from "@/components/modules/home/Categories";
import HomeSlide from "@/components/modules/home/HomeSlide";
import Services from "@/components/modules/home/Services";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";

import React from "react";

const Home = () => {
  return (
    <>
      <HomeSlide />
      <Services />
      <Categories />
      <FeaturedProducts />
    </>
  );
};

export default Home;
