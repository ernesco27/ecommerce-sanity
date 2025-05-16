"use client";

import React from "react";
import SidebarMenu from "./SidebarMenu";
import { CiMenuFries } from "react-icons/ci";
import { useCategories } from "@/store/categoriesStore";
import { usePages } from "@/store/pagesStore";

const SidebarMenuContainer = () => {
  const { pages } = usePages();
  const { categories } = useCategories();

  // Optional: Add loading state
  if (!pages || !categories)
    return (
      <div>
        <CiMenuFries size={34} />
      </div>
    );

  return <SidebarMenu categories={categories} pages={pages} />;
};

export default SidebarMenuContainer;
