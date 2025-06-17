"use client";

import React, { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CiMenuFries } from "react-icons/ci";
import { cn } from "@/lib/utils";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Category, Page, Subcategory } from "../../../../sanity.types";

const SidebarMenu = ({
  categories,
  pages,
}: {
  categories: Category[];
  pages: Page[];
}) => {
  const [show, setShow] = useState(false);
  const [subCategory, setSubCategory] = useState<Subcategory[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <CiMenuFries size={34} />
        </SheetTrigger>
        <SheetContent
          className={cn("px-4 w-full [&>#closeBtn]:text-3xl ", "md:w-[400px]")}
        >
          <VisuallyHidden asChild>
            <SheetHeader>
              <SheetTitle>Side Menu</SheetTitle>
              <SheetDescription>
                Select categories and pages here
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden>

          <div className="mt-10">
            <Tabs defaultValue="category">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="category">Categories</TabsTrigger>
                <TabsTrigger value="page">Pages</TabsTrigger>
              </TabsList>
              <TabsContent value="category">
                <div className="flex flex-col gap-4 h-full">
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map((category: Category) => (
                      <AccordionItem value={category._id} key={category._id}>
                        <AccordionTrigger
                          onClick={(e) => {
                            // Prevent accordion toggle when clicking the category name
                            if ((e.target as HTMLElement).tagName === "SPAN") {
                              e.stopPropagation();
                              router.push(`/categories/${category.slug}`);
                              setOpen(false);
                            }
                          }}
                          className="hover:no-underline"
                        >
                          <span className="text-lg hover:text-primary-500">
                            {category.title}
                          </span>
                        </AccordionTrigger>
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <AccordionContent>
                              <div className="flex flex-col space-y-2 pl-4">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/categories/${category.slug}?subcategory=${sub.slug}`}
                                    className="text-lg hover:text-primary-500 py-2"
                                    onClick={() => setOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              <TabsContent value="page">
                <div className="flex flex-col gap-4 h-full">
                  <span
                    onClick={() => {
                      router.push("/products");
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:text-primary-900 capitalize"
                  >
                    Shop
                  </span>
                  {pages.map((page: Page) => (
                    <div
                      key={page._id}
                      className="group inline-flex items-center px-4 py-2 gap-4 w-full hover:text-primary-900 capitalize"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span
                          onClick={() => {
                            router.push(`${page.slug?.current}`);
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          {page.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={show}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="px-4 w-full [&>#closeBtn]:hidden md:w-[400px]"
          side="left"
        >
          <div className="duration-300 ease-in p-8 absolute top-0 h-screen left-0 bg-white w-[260px">
            <Button
              onClick={() => setShow(!show)}
              variant="default"
              title="back"
              className="hover:bg-black hover:text-white"
            >
              <ChevronLeft />
            </Button>
            <div className="flex flex-col gap-8 justify-center mt-12">
              {subCategory?.map((item: Subcategory) => (
                <Link
                  className="Capitalize hover:text-primary-800"
                  href={`/categories/${item.slug?.current || ""}`}
                  key={item._id}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SidebarMenu;
