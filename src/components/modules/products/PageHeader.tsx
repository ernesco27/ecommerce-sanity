"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import useSWR from "swr";
import { Banner } from "../../../../sanity.types";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  link1?: string;
  link2?: string;
  link3?: string;
}

type BannerResponse = Banner & {
  imageUrl: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  heading,
  link1,
  link2,
  link3,
}) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: banners,
    error,
    isLoading,
  } = useSWR<BannerResponse[]>("/api/banners?type=promo", fetcher);

  const headerImage = banners?.[3]?.imageUrl;

  return (
    <div
      className="flex flex-col gap-4 lg:gap-10 justify-center items-center w-full h-[100px] lg:h-[250px] lg:bg-auto mb-4"
      style={{
        backgroundImage: headerImage ? `url(${headerImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role="banner"
      aria-label="Page header"
    >
      <h2 className="text-3xl lg:text-4xl capitalize font-normal ">
        {heading}
      </h2>

      <Breadcrumb aria-label="Breadcrumb navigation">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              href="/"
              className="text-lg text-black lg:text-2xl hover:text-primary-600 "
            >
              Home
            </Link>
          </BreadcrumbItem>
          {link1 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  href={`/${link1}`}
                  className="text-lg text-black lg:text-2xl hover:text-yellow-600 "
                >
                  {link1.charAt(0).toUpperCase() + link1.slice(1)}
                </Link>
              </BreadcrumbItem>
            </>
          )}
          {link2 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-lg capitalize text-black lg:text-2xl hover:text-yellow-600 cursor-pointer ">
                  {link2}
                </p>
                {/* <Link
                  href={`/${link1}`}
                  className="text-lg capitalize text-black lg:text-2xl hover:text-primary-600 "
                >
                  {link2}
                </Link> */}
              </BreadcrumbItem>
            </>
          )}
          {link3 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  href={`/${link1}/${link2}/${link3}`}
                  className="text-lg capitalize text-black lg:text-2xl hover:text-yellow-600 "
                >
                  {link3}
                </Link>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageHeader;
