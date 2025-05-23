"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Skeleton } from "@mui/material";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  title: string;
  slug: string;
  subcategories: SubCategory[];
}

interface ProductsCatAccordionProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const ProductsCatAccordion: React.FC<ProductsCatAccordionProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton className="w-full" height={600} />
      ) : (
        <Accordion type="single" collapsible className="w-full pl-10">
          {categories?.map((item) => (
            <AccordionItem key={item._id} value={item._id}>
              <AccordionTrigger className="!py-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={item._id}
                    checked={selectedCategories.includes(item._id)}
                    onCheckedChange={() => toggleCategory(item._id)}
                    className="data-[state=checked]:bg-yellow-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={item._id}
                    className="text-xl font-medium cursor-pointer hover:text-yellow-600"
                  >
                    {item.title}
                  </Label>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 ms-10">
                  {item.subcategories?.map((itemSub) => (
                    <div
                      key={itemSub._id}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Checkbox
                        id={itemSub._id}
                        checked={selectedCategories.includes(itemSub._id)}
                        onCheckedChange={() => toggleCategory(itemSub._id)}
                        className="data-[state=checked]:bg-yellow-600"
                      />
                      <Label
                        htmlFor={itemSub._id}
                        className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-yellow-600"
                      >
                        {itemSub.name}
                      </Label>
                    </div>
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
