"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { Category, Subcategory } from "../../../sanity.types";

const ProductsCatAccordion = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  //API CALL

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      await axios
        .get("/api/categories")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getCategories();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton className=" w-full" height={600} />
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {categories?.slice(0, 20).map((item: Category) => (
            <AccordionItem key={item._id} value={`${item._id}`}>
              <AccordionTrigger className="!py-0">
                <Link
                  href={`/categories/${item.slug?.current}`}
                  className="text-xl text-left"
                >
                  <span className="text-xl ">{item.title}</span>
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 ms-10">
                  {item.subcategories?.map((itemSub: any) => (
                    <Link
                      key={itemSub._id}
                      href={`${itemSub.slug?.current}`}
                      className="text-xl min-w-40 hover:text-primary-900"
                    >
                      {itemSub.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default ProductsCatAccordion;
