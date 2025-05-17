"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ProductsQueryResult } from "../../../../sanity.types";

export default function ProductDetail() {
  const { id } = useParams();
  const { trackProductView } = useAnalytics();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: product, error } = useSWR<ProductsQueryResult[0]>(
    `/api/products/${id}`,
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

  return <div>{/* Product detail UI implementation */}</div>;
}
