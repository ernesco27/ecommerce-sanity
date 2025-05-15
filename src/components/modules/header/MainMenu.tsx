"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import useSWR, { Fetcher } from "swr";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Category, Subcategory } from "../../../../sanity.types";
import { Button } from "@/components/ui/button";

interface CategoriesResponse {
  categories: Category[];
}

const MainMenu = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data: pageData } = useSWR<Page[]>("/api/pages", fetcher);
  // const { data: categoryData } = useSWR<Category[]>("/api/categories", fetcher);

  const fetcher: Fetcher<CategoriesResponse> = (url: string) =>
    fetch(url).then((res) => res.json());

  const { data } = useSWR<CategoriesResponse>("/api/categories", fetcher);

  const categories = data?.categories || [];

  const router = useRouter();

  console.log("categories", categories);

  return (
    <section className="hidden lg:flex z-10 relative">
      <ul className="flex justify-between items-center gap-32 ">
        {/* {["Home", "Shop", "Contact"].map((name) => {
          const page = pageData?.find((page) => page.name === name);
          return page ? (
            <li key={page.id} className="relative">
              <Link
                className={cn(
                  "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-700 after:duration-100 after:ease-linear hover:after:w-full ",
                  pathname === `${page.link}` &&
                    "border-b-4 border-primary-400 capitalize",
                )}
                href={`${page.link}`}
              >
                {page.name}
              </Link>
            </li>
          ) : null;
        })} */}
        <li className="relative">
          <Link
            href="/"
            className={cn(
              "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-700 after:duration-100 after:ease-linear hover:after:w-full ",
              pathname === `${"/home"}` &&
                "border-b-4 border-primary-400 capitalize",
            )}
          >
            Home
          </Link>
        </li>
        <li className="relative">
          <Link
            href="/"
            className={cn(
              "text-xl h-full duration-300 after:absolute after:top-[26px] after:left-0 after:w-0 after:h-1 after:bg-primary-700 after:duration-100 after:ease-linear hover:after:w-full ",
              pathname === `${"/home"}` &&
                "border-b-4 border-primary-400 capitalize",
            )}
          >
            Shop
          </Link>
        </li>

        {/* Categories */}
        <li className="group">
          <button
            className="capitalize inline-flex items-center text-lg cursor-pointer"
            onClick={() => {
              console.log("clicked");
              setShow(!show);
            }}
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
                className="z-50 h-[440px] bg-yellow-500  w-[950px] absolute right-0 top-[54px] shadow-xl"
              >
                <div className="grid grid-cols-4 justify-items-center grid-rows-auto max-h-[450px]  bg-white p-4  gap-8  overflow-hidden ">
                  {categories?.map((cat: Category) => {
                    return (
                      <ul
                        key={cat._id}
                        className="flex flex-col gap-4 text-xl "
                      >
                        <li>
                          <Link
                            href={`/categories/${cat.slug?.current}`}
                            className="font-bold group/item w-full transition-all flex items-center gap-2 duration-100 ease-linear hover:translate-x-1 capitalize"
                          >
                            <h5 className="transition ease-in-out hover:text-yellow-800">
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
                                  className="hover:text-yellow-600"
                                  href={`/categories/${sub.slug?.current}`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ),
                          )}
                      </ul>
                    );
                  })}
                  <div className="flex flex-col items-center gap-4 pt-8 w-[200px] h-[400px]   bg-[url('/assets/catmenu.jpg')] bg-center ">
                    <p className="text-lg">-Latest Offers</p>
                    <p>Upto 15% OFF</p>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-lg"
                      onClick={() => router.push("/products")}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </section>
  );
};

export default MainMenu;
