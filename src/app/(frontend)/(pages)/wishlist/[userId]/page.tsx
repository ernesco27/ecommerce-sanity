"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Container from "@/components/custom/Container";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  Table,
} from "@/components/ui/table";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import { useCartStore } from "@/store/cartStore";

interface WishlistItem {
  _id: string;
  _key: string;
  addedAt: string;
  quantity: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  product: {
    _id: string;
    name: string;
    images: {
      primary: {
        url: string;
        alt: string;
      };
    };
  };
  variant: {
    variantId: string;
    size: string;
    price: number;
    color: string;
    stock: number;
  };
}

export default function PublicWishlist() {
  const params = useParams();

  const [wishlist, setWishList] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wishlist/${params.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        const data = await response.json();
        setWishList(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [params.userId]);

  const handleAddToCart = (item: WishlistItem) => {
    const imageUrl = item.product?.images.primary.url;
    const selectedVariant = {
      _id: item.variant.variantId,
      _type: "productVariant" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      size: item.variant.size as "S" | "M" | "L" | "XL" | "2XL",
      price: item.variant.price,
      sku: "",
      color: item.variant.color,
      colorVariants: [
        {
          color: item.variant.color as
            | "red"
            | "green"
            | "blue"
            | "black"
            | "white"
            | "gray"
            | "navy"
            | "brown",
          stock: item.variant.stock,
          _type: "colorVariant" as const,
          _key: "default",
        },
      ],
    };
    const selectedColor = item.variant.color;
    const quantity = item.quantity;

    const result = addItem(
      {
        _id: item.product._id,
        _type: "product" as const,
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
        _rev: "",
        name: item.product.name,
        variants: [
          {
            _ref: item.variant.variantId,
            _type: "reference" as const,
            _key: "default",
          },
        ],
      },
      selectedVariant,
      selectedColor,
      quantity,
      imageUrl,
    );

    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart");
      return;
    }

    toast.success("Product added to cart");
  };

  if (loading) {
    return (
      <Container className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
      </Container>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-muted-foreground">This wishlist is empty.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {wishlist[0]?.user.firstName}'s Wishlist
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse and add items to your cart
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="py-4 lg:p-6">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl font-semibold">
              Wishlist Items
            </CardTitle>
            <CardDescription className="text-sm lg:text-md">
              Items in this wishlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-md lg:text-lg">
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.map((item) => (
                  <TableRow key={item.product._id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={
                              item.product?.images?.primary.url ||
                              "/placeholder.png"
                            }
                            alt={item.product?.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-md lg:text-lg">
                            {item.product.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-md lg:text-lg">
                      {item.variant?.size}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-md lg:text-lg">
                        {item.variant?.color}
                      </span>
                    </TableCell>
                    <TableCell>
                      <CurrencyFormat
                        value={item.variant?.price}
                        className="text-md lg:text-lg"
                      />
                    </TableCell>
                    <TableCell className="text-md lg:text-lg">
                      {item.quantity}
                    </TableCell>
                    <TableCell>
                      <CurrencyFormat
                        value={item.variant?.price * item.quantity}
                        className="text-md lg:text-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="default"
                          className="cursor-pointer"
                          onClick={() => handleAddToCart(item)}
                          disabled={
                            !item.variant?.stock || item.variant.stock <= 0
                          }
                        >
                          Add To Cart
                        </Button>
                        {(!item.variant?.stock || item.variant.stock <= 0) && (
                          <span className="text-red-500 text-sm">
                            Out of Stock
                          </span>
                        )}
                        {item.variant?.stock &&
                          item.variant.stock > 0 &&
                          item.variant.stock < 5 && (
                            <span className="text-yellow-500 text-sm">
                              Low Stock - Only {item.variant.stock} left!
                            </span>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
