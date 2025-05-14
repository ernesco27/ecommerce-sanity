"use client";

import React from "react";
import SidebarMenu from "./SidebarMenu";
//import { Category, Page } from "@/types";
import useSWR from "swr";
import { CiMenuFries } from "react-icons/ci";

const SidebarMenuContainer = () => {
  // const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data: catData } = useSWR<Category[]>("/api/categories", fetcher);
  // const { data: pageData } = useSWR<Page[]>("/api/pages", fetcher);

  // Optional: Add loading state
  // if (!catData || !pageData)
  //   return (
  //     <div>
  //       <CiMenuFries size={34} />
  //     </div>
  //   );

  return <SidebarMenu />;
};

export default SidebarMenuContainer;
