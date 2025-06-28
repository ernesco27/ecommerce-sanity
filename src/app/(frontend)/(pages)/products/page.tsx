import React from "react";

import { Metadata } from "next";
import PageHeader from "@/components/modules/products/PageHeader";
import ProductsContainer from "@/components/modules/products/ProductsContainer";

const page = () => {
  return (
    <>
      {/* <PageHeader heading="Shop" link1="shop" /> */}

      <ProductsContainer />
    </>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Edimays Couture - Products Page",
  description: "Your Go To Online Fahion Store",
  icons: {
    icon: "/assets/logo.png",
  },
};
