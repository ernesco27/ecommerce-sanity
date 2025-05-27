"use client";

import Container from "@/components/custom/Container";
import PageHeader from "@/components/modules/products/PageHeader";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect, useState } from "react";
import NumberInput from "@/components/custom/NumberInput";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import { BsCartX } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Services from "@/components/modules/home/Services";

const page = () => {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, getTotalPrice, getTotalItems, hydrated } =
    useCartStore();

  console.log("items", items);

  const router = useRouter();

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (productId: string, variantId: string) => {
    removeItem(productId, variantId);
  };

  const handleCheckout = () => {
    console.log("checkout");
  };

  // Don't render anything until after hydration
  if (!mounted || !hydrated) {
    return null;
  }

  return (
    <div>
      <PageHeader heading="Shopping Cart" link1="cart" />
      <Container>
        {!items.length ? (
          <div className="flex flex-col gap-4 items-center justify-center h-full my-10">
            <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
              <BsCartX className="text-8xl text-gray-500" />
            </div>

            <p className="text-2xl font-bold">No items in cart</p>
            <p className="text-lg text-gray-500">Add items to your cart</p>
            <Button
              onClick={() => router.push("/products")}
              variant="outline"
              className="bg-yellow-500 text-white capitalize cursor-pointer text-lg"
            >
              Visit Store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-10 ">
            {/* Cart Items */}
            <div className="col-span-2">
              <Table className="">
                <TableHeader className="bg-yellow-400">
                  <TableRow>
                    <TableHead className="w-[20px]  text-black text-lg lg:text-xl"></TableHead>
                    <TableHead className=" text-black text-lg lg:text-xl">
                      Product
                    </TableHead>
                    <TableHead className="text-black text-lg lg:text-xl">
                      Price
                    </TableHead>
                    <TableHead className="text-black text-lg lg:text-xl">
                      Quantity
                    </TableHead>
                    <TableHead className="text-black text-lg lg:text-xl">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={`${item._id}-${item.selectedVariant._id}-${item.selectedVariant.color}`}
                    >
                      {/* Action */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() =>
                            handleRemoveItem(item._id, item.selectedVariant._id)
                          }
                        >
                          <FaRegTrashCan />
                        </Button>
                      </TableCell>
                      {/* Product */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.selectedVariant?.imageUrl && (
                            <div className="w-[60px] h-[60px] rounded-md overflow-hidden">
                              <img
                                src={item.selectedVariant?.imageUrl}
                                alt={item.name}
                                className="object-cover overflow-hidden"
                              />
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-bold">
                              {" "}
                              {item.name.substring(0, 40)}
                            </p>
                            <div className="flex gap-2 h-5 items-center text-[16px] text-gray-500">
                              <span className="capitalize">
                                Color: {item.selectedVariant.color}
                              </span>
                              <Separator orientation="vertical" />

                              <span>Size: {item.selectedVariant.size}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {/* Price */}
                      <TableCell>
                        <CurrencyFormat
                          value={item.selectedVariant.price}
                          className="font-semibold text-base"
                        />
                      </TableCell>
                      {/* Quantity */}
                      <TableCell>
                        <NumberInput
                          quantity={quantity}
                          setQuantity={setQuantity}
                          max={5}
                        />
                      </TableCell>
                      {/* Subtotal */}
                      <TableCell>
                        <CurrencyFormat
                          value={item.selectedVariant.price * quantity}
                          className="font-semibold text-base"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between my-12">
                <div className="flex flex-col lg:flex-row gap-2 w-1/2">
                  <Input
                    placeholder="Enter coupon code"
                    className="py-5 px-4 md:text-lg focus-visible:ring-yellow-200 "
                  />
                  <Button
                    variant="outline"
                    className="bg-yellow-800 text-white capitalize cursor-pointer text-lg py-5 px-4 hover:bg-yellow-600 hover:text-white transition-all duration-300 ease-in-out"
                  >
                    Apply Coupon
                  </Button>
                </div>
                <p
                  onClick={() => {}}
                  className="text-lg underline cursor-pointer text-yellow-800 font-semibold hover:text-red-500 transition-all duration-300 ease-in-out"
                >
                  Clear Shopping Cart
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-1 p-4 border border-border rounded-md flex flex-col gap-4">
              <p className="text-lg font-bold">Order Summary</p>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Items</p>
                <p className="text-lg font-semibold">{getTotalItems()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Subtotal</p>
                <CurrencyFormat
                  value={getTotalPrice()}
                  className="text-right font-semibold"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Shipping</p>
                <p className="text-lg font-semibold">GHs 0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Taxes</p>
                <p className="text-lg font-semibold">GHs 0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Coupon Discount</p>
                <p className="text-lg font-semibold text-red-500">
                  ( GHs 0.00)
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Total</p>
                <CurrencyFormat
                  value={getTotalPrice()}
                  className="text-right font-semibold"
                />
              </div>
              <Button
                variant="outline"
                className="bg-yellow-800 text-white capitalize cursor-pointer text-lg py-7 px-4 hover:bg-yellow-600 hover:text-white transition-all duration-300 ease-in-out"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
        <Services />
      </Container>
    </div>
  );
};

export default page;
