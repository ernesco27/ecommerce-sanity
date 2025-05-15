"use client";

import React from "react";
import SidebarMenu from "./SidebarMenu";
//import { Category, Page } from "@/types";
import useSWR, { Fetcher } from "swr";
import { CiMenuFries } from "react-icons/ci";
import { Category } from "../../../../sanity.types";

interface CategoriesResponse {
  categories: Category[];
}

const SidebarMenuContainer = () => {
  // const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data: catData } = useSWR<Category[]>("/api/categories", fetcher);
  // const { data: pageData } = useSWR<Page[]>("/api/pages", fetcher);

  const fetcher: Fetcher<CategoriesResponse> = (url: string) =>
    fetch(url).then((res) => res.json());

  const { data } = useSWR<CategoriesResponse>("/api/categories", fetcher);

  // Optional: Add loading state
  // if (!catData || !pageData)
  //   return (
  //     <div>
  //       <CiMenuFries size={34} />
  //     </div>
  //   );

  // Optional: Add loading state
  if (!data)
    return (
      <div>
        <CiMenuFries size={34} />
      </div>
    );

  return <SidebarMenu categories={data?.categories || []} />;
};

export default SidebarMenuContainer;
