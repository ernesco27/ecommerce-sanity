"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Banner, Category, Subcategory } from "../../../../sanity.types";
import { Button } from "@/components/ui/button";
import { usePages } from "@/store/pagesStore";
import { useCategories } from "@/store/categoriesStore";
import useSWR from "swr";

type BannerResponse = Banner & {
  imageUrl: string;
};

const MainMenu = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const { pages } = usePages();
  const { categories } = useCategories();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: banners } = useSWR<BannerResponse[]>(
    "/api/banners?type=promo",
    fetcher,
  );

  const router = useRouter();

  return (
    <section className="hidden lg:flex z-10 relative">
      <ul className="flex-between gap-10  ">
        <li className="relative">
          <Link
            href="/"
            className={cn(
              "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-900 after:duration-100 after:ease-linear hover:after:w-full ",
              pathname === `${"/"}` &&
                "border-b-4 border-primary-500 capitalize",
            )}
          >
            Home
          </Link>
        </li>
        <li className="relative">
          <Link
            href="/products"
            className={cn(
              "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-900 after:duration-100 after:ease-linear hover:after:w-full ",
              pathname === `${"/products"}` &&
                "border-b-4 border-primary-500 capitalize",
            )}
          >
            Shop
          </Link>
        </li>

        {/* Categories */}
        <li className="relative text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-900 after:duration-100 after:ease-linear hover:after:w-full">
          <button
            className="capitalize inline-flex items-center text-lg cursor-pointer"
            onClick={() => setShow(!show)}
          >
            Categories
            <ChevronDown />
          </button>
          <AnimatePresence>
            {show && (
              <motion.div
                onMouseLeave={() => setShow(false)}
                initial={{ opacity: 0, y: -15 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { type: "spring", duration: 0.7 },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  filter: "blur(5px)",
                  transition: { ease: "easeIn", duration: 0.22 },
                }}
                className="z-50 h-[440px] bg-primary-500  w-[950px] absolute -right-100 top-[54px] shadow-xl"
              >
                <div className="grid grid-cols-4 justify-items-center grid-rows-auto max-h-[450px]   p-4  gap-8  overflow-hidden background-light900_dark200 ">
                  {categories?.map((cat: Category) => {
                    return (
                      <ul
                        key={cat._id}
                        className="flex flex-col gap-4 text-xl "
                      >
                        <li>
                          <Link
                            href={`/categories/${cat.slug}`}
                            className="font-bold group/item w-full transition-all flex items-center gap-2 duration-100 ease-linear hover:translate-x-1 capitalize"
                          >
                            <h5 className="transition ease-in-out hover:text-primary-500">
                              {cat.title}
                            </h5>
                          </Link>
                        </li>

                        {cat.subcategories &&
                          (cat.subcategories as unknown as Subcategory[]).map(
                            (sub) => (
                              <li
                                key={sub._id}
                                className="font-normal duration-300 hover:translate-x-1 capitalize"
                              >
                                <Link
                                  className="hover:text-primary-500"
                                  href={`/categories/${cat.slug}?subcategory=${sub.slug}`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ),
                          )}
                      </ul>
                    );
                  })}
                  <div
                    className="flex flex-col items-center gap-4 pt-8 w-[200px] h-[400px]   bg-center "
                    style={{
                      backgroundImage: `url(${banners?.[4]?.imageUrl})`,
                    }}
                  >
                    <p className="text-lg">{banners?.[4]?.subTitle}</p>
                    <p>{banners?.[4]?.description}</p>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-lg hover:bg-primary-500 cursor-pointer hover:shadow-md capitalize"
                      onClick={() =>
                        router.push(banners?.[4]?.link || "/products")
                      }
                    >
                      {banners?.[4]?.buttonText}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
        {["About Us", "Contact Us"].map((title) => {
          const page = pages?.find((page) => page.title === title);
          return page ? (
            <li key={page._id} className="relative">
              <Link
                className={cn(
                  "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-900 after:duration-100 after:ease-linear hover:after:w-full ",
                  pathname === `${page.slug?.current}` &&
                    "border-b-4 border-primary-500 capitalize",
                )}
                href={`${page.slug?.current}`}
              >
                {page.title}
              </Link>
            </li>
          ) : null;
        })}
      </ul>
    </section>
  );
};

export default MainMenu;
