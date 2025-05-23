import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Metadata } from "next";
import PageHeader from "@/components/modules/products/PageHeader";
import ProductsContainer from "@/components/modules/products/ProductsContainer";

const page = () => {
  return (
    <>
      <section className="my-10">
        <PageHeader heading="Shop" link1="shop" />
      </section>

      <ProductsContainer />
    </>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Edimays Couture - Products page",
  description: "Your Go To Online Fahion Store",
  icons: {
    icon: "/assets/logo.png",
  },
};
