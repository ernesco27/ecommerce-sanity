"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useAnalytics } from "@/hooks/useAnalytics";

import PageHeader from "@/components/modules/products/PageHeader";
import ProductData from "@/components/modules/products/ProductData";
import { Product } from "../../../../../../sanity.types";

interface ProductDetailProps {
  slug: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { trackProductView } = useAnalytics();

  // Use SWR for real-time updates while passing initial data
  const { data: product, error } = useSWR<Product>(
    `/api/products/${slug}`,
    fetcher,
  );

  useEffect(() => {
    if (product?._id) {
      // Get userId from session/cookie if available
      const session = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("session="));
      const userId = session
        ? JSON.parse(decodeURIComponent(session.split("=")[1])).userId
        : undefined;

      // Track product view
      trackProductView(product._id, userId);
    }
  }, [product?._id]);

  if (error) return <div>Failed to load product</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <>
      <PageHeader
        heading="Product Details"
        link1="products"
        link2={product.name}
      />
      {/* Add your product detail UI implementation here */}
      <ProductData product={product} />
    </>
  );
}
