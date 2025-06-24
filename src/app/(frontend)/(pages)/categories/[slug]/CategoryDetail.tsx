"use client";

import React, { useState, useEffect } from "react";
import { Category, ProductsQueryResult } from "../../../../../../sanity.types";
import Container from "@/components/custom/Container";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/custom/ProductCard";
import PageHeader from "@/components/modules/products/PageHeader";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryDetailProps {
  category: Category;
}

const CategoryDetail = ({ category }: CategoryDetailProps) => {
  const searchParams = useSearchParams();
  const subcategorySlug = searchParams.get("subcategory");

  // Find the subcategory ID from the slug
  const selectedSubcategoryId = subcategorySlug
    ? category.subcategories?.find(
        (sub) => (sub.slug as unknown as string) === subcategorySlug,
      )?._id
    : undefined;

  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >(selectedSubcategoryId);

  const { products, isLoading, isError } = useProducts({
    category: category._id,
    subcategory: selectedSubcategory,
  });

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <PageHeader
        heading={category?.title || ""}
        link1="categories"
        link2={category?.title || ""}
      />

      {/* Subcategories (if any) */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="my-8">
          <Container>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setSelectedSubcategory(undefined)}
                className={cn(
                  `px-4 py-2 rounded-full cursor-pointer`,
                  !selectedSubcategory
                    ? "bg-primary-900 text-white"
                    : "bg-gray-100 dark:bg-gray-100/20 dark:hover:bg-gray-100/30 hover:bg-gray-200",
                )}
              >
                All
              </button>
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  onClick={() => setSelectedSubcategory(subcategory._id)}
                  className={cn(
                    `px-4 py-2 rounded-full cursor-pointer`,
                    selectedSubcategory === subcategory._id
                      ? "bg-primary-900 text-white"
                      : "bg-gray-100 dark:bg-gray-100/20 dark:hover:bg-gray-100/30 hover:bg-gray-200",
                  )}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Products Grid */}
      <section className="my-8">
        <Container>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: ProductsQueryResult[0]) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found in this category
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default CategoryDetail;
