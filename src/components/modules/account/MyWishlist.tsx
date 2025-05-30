"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import type { ProductsQueryResult } from "../../../../sanity.types";

interface WishlistItem {
  _id: string;
  product: ProductsQueryResult[number];
}

const MyWishlist = () => {
  const { user } = useUser();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: wishlist,
    error,
    mutate,
  } = useSWR<WishlistItem[]>(user ? "/api/wishlist" : null, fetcher);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Check if product has variants
    if (!item.product.variants || item.product.variants.length === 0) {
      toast.error("Product variants not available");
      return;
    }

    // Get the first available variant and color
    const firstVariant = item.product.variants[0];
    const firstColorVariant = firstVariant.colorVariants?.[0];

    if (!firstColorVariant) {
      toast.error("Product color variants not available");
      return;
    }

    // Ensure we have a valid color
    const color = firstColorVariant.color || "black";

    const result = addToCart(
      {
        _id: item.product._id,
        _type: "product",
        _createdAt: item.product._createdAt,
        _updatedAt: item.product._createdAt,
        _rev: "",
        name: item.product.name || "",
        images: {
          primary: {
            _type: "image",
            asset: {
              _ref: "",
              _type: "reference",
            },
            alt: item.product.images?.primary?.alt || "",
          },
        },
      },
      {
        _id: firstVariant._id,
        _type: "productVariant",
        _createdAt: item.product._createdAt,
        _updatedAt: item.product._createdAt,
        _rev: "",
        size: firstVariant.size || undefined,
        price: firstVariant.price || 0,
        sku: firstVariant.sku || "",
        colorVariants: [
          {
            _type: "colorVariant",
            _key: Math.random().toString(36).substr(2, 9),
            color,
            colorCode: firstColorVariant.colorCode || undefined,
            stock: firstColorVariant.stock || 0,
            images:
              firstColorVariant.images?.map((img) => ({
                _type: "image",
                _key: Math.random().toString(36).substr(2, 9),
                asset: {
                  _ref: "",
                  _type: "reference",
                },
                alt: img.alt || "",
              })) || [],
          },
        ],
      },
      color,
      1,
      firstColorVariant.images?.[0]?.url ||
        item.product.images?.primary?.url ||
        "",
    );

    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart");
      return;
    }

    toast.success("Product added to cart");
  };

  if (error) {
    return <div>Failed to load wishlist</div>;
  }

  if (!wishlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Wishlist</h2>
        <p className="text-sm text-muted-foreground">
          Save items for later and keep track of products you love
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button className="mt-4" onClick={() => router.push("/products")}>
            Discover Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item._id} className="relative group">
              <div className="aspect-square relative">
                <Image
                  src={item.product.images?.primary?.url || "/placeholder.jpg"}
                  alt={
                    item.product.images?.primary?.alt ||
                    item.product.name ||
                    "Product image"
                  }
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{item.product.name}</h3>
                <p className="text-lg font-bold mt-2">
                  ${item.product.pricing?.min.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item.product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
