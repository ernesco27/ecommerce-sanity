"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

import { useWishlist } from "@/hooks/wishlist";
import Container from "@/components/custom/Container";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  Table,
} from "@/components/ui/table";
import { IoIosShareAlt } from "react-icons/io";

import CurrencyFormat from "@/components/custom/CurrencyFormat";

interface WishlistItem {
  _id: string;
  _key: string;
  addedAt: string;
  quantity: number;

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

const MyWishlist = () => {
  const { user } = useUser();
  const router = useRouter();
  const [wishlist, setWishList] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const addItem = useCartStore((state) => state.addItem);

  const { getWishlist } = useWishlist();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const wishlist = await getWishlist();

        setWishList(wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [getWishlist]);

  console.log("wishlist", wishlist);

  // if (userError || ordersError) {
  //   return <div>Failed to load orders</div>;
  // }

  if (loading) {
    return (
      <Container className="flex items-center justify-center">
        <Loader2 className=" w-10 h-10  animate-spin text-yellow-500" />
      </Container>
    );
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      // Update the local state by filtering out the removed item
      setWishList((prev) =>
        prev.filter((item) => item.product._id !== productId),
      );
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

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
      sku: "", // Not available in wishlist item
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
          stock: item.variant.stock, // Not available in wishlist item
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

  if (!wishlist) {
    return <div>Loading...</div>;
  }

  const handleShareWishlist = async () => {
    try {
      const wishlistUrl = `${window.location.origin}/wishlist/${user?.id}`;

      if (navigator.share) {
        await navigator.share({
          title: "My Wishlist",
          text: "Check out my wishlist!",
          url: wishlistUrl,
        });
      } else {
        await navigator.clipboard.writeText(wishlistUrl);
        toast.success("Wishlist link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing wishlist:", error);
      toast.error("Failed to share wishlist");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Wishlist</h2>
          <p className="text-sm text-muted-foreground">
            Save items for later and keep track of products you love
          </p>
        </div>

        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleShareWishlist}
        >
          <IoIosShareAlt /> Share
        </Button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button className="mt-4" onClick={() => router.push("/products")}>
            Discover Products
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card className="py-4 lg:p-6">
            <CardHeader>
              <CardTitle className="text-xl lg:text-2xl font-semibold">
                Wishlist Items
              </CardTitle>
              <CardDescription className="text-sm lg:text-md">
                Items included in your wishlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-md lg:text-lg">
                    <TableHead></TableHead>
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
                        <Button
                          size="icon"
                          onClick={() =>
                            handleRemoveFromWishlist(item.product._id)
                          }
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
                            <p className="font-medium text-md lg:text-lg ">
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
                          {(!item.variant?.stock ||
                            item.variant.stock <= 0) && (
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
      )}
    </div>
  );
};

export default MyWishlist;
