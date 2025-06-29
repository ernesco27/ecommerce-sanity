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

import CurrencyFormat from "@/components/custom/CurrencyFormat";
import { BsCartX } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Services from "@/components/modules/home/Services";
import { toast } from "sonner";
import { X } from "lucide-react";

const page = () => {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const {
    items,
    removeItem,
    getTotalPrice,
    getTotalItems,
    hydrated,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    appliedDiscounts,
    getDiscountTotal,
    getFinalPrice,
    taxSettings,
    getTaxAmount,
  } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (productId: string, variantId: string) => {
    removeItem(productId, variantId);
  };

  const handleQuantityChange = (
    productId: string,
    variantId: string,
    newQuantity: number,
  ) => {
    const result = updateQuantity(productId, variantId, newQuantity);
    if (!result.success && result.error) {
      // You might want to add a toast notification here
      console.error(result.error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    try {
      const result = await applyDiscount(couponCode.trim());
      if (result.success) {
        toast.success("Coupon applied successfully!");
        setCouponCode("");
      } else {
        toast.error(result.error || "Failed to apply coupon");
      }
    } catch (error) {
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = (discountId: string) => {
    removeDiscount(discountId);
    toast.info("Discount removed");
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
          <div className="flex-center flex-col gap-4  h-full my-10 ">
            <div className="w-40 h-40 rounded-full background-light800_dark400 flex-center">
              <BsCartX className="text-8xl text-gray-500" />
            </div>

            <p className="text-2xl font-bold">No items in cart</p>
            <p className="text-lg text-gray-500">Add items to your cart</p>
            <Button
              onClick={() => router.push("/products")}
              variant="outline"
              className="bg-primary-500 dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50   text-white capitalize cursor-pointer text-lg"
            >
              Visit Store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-10 ">
            {/* Cart Items */}
            <div className="col-span-2">
              <Table>
                <TableHeader className="bg-primary-500">
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
                          quantity={item.quantity}
                          setQuantity={(newQuantity) =>
                            handleQuantityChange(
                              item._id,
                              item.selectedVariant._id,
                              newQuantity,
                            )
                          }
                          max={item.selectedVariant.stock}
                        />
                      </TableCell>
                      {/* Subtotal */}
                      <TableCell>
                        <CurrencyFormat
                          value={item.selectedVariant.price * item.quantity}
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
                    className="py-5 px-4 md:text-lg "
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button
                    variant="outline"
                    className="bg-primary-900 dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 text-white capitalize cursor-pointer text-lg py-5 px-4 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out"
                    onClick={handleApplyCoupon}
                    disabled={isApplying}
                  >
                    {isApplying ? "Applying..." : "Apply Coupon"}
                  </Button>
                </div>
                <p
                  onClick={clearCart}
                  className="text-sm lg:text-lg underline cursor-pointer text-primary-900 dark:text-primary-500  font-semibold hover:!text-red-500 transition-all duration-300 ease-in-out"
                >
                  x Clear Shopping Cart
                </p>
              </div>
              {/* Applied Discounts */}
              {appliedDiscounts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">
                    Applied Discounts
                  </h3>
                  <div className="space-y-2">
                    {appliedDiscounts.map((discount) => (
                      <div
                        key={discount._id}
                        className="flex items-center justify-between background-light800_dark400 p-3 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{discount.name}</p>
                          <p className="text-sm text-gray-600">
                            Code: {discount.code}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <CurrencyFormat
                            value={discount.amount}
                            className="text-green-600 font-semibold"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-red-500"
                            onClick={() => handleRemoveDiscount(discount._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="col-span-1 p-4 border border-border rounded-md flex flex-col gap-4">
              <p className="text-lg font-bold">Order Summary</p>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Items</p>
                <p className="text-lg">{getTotalItems()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Subtotal</p>
                <CurrencyFormat
                  value={getTotalPrice()}
                  className="text-right "
                />
              </div>
              {getDiscountTotal() > 0 && (
                <div className="flex justify-between">
                  <p className="text-lg text-gray-500">Discount</p>
                  <p className="text-lg font-semibold text-red-500">
                    - <CurrencyFormat value={getDiscountTotal()} />
                  </p>
                </div>
              )}
              {taxSettings?.isEnabled && taxSettings.displayTax && (
                <div className="flex justify-between">
                  <p className="text-lg text-gray-500">
                    Tax {taxSettings.taxIncluded ? "(Included)" : ""}
                  </p>
                  <p className="text-lg font-semibold">
                    <CurrencyFormat value={getTaxAmount()} />
                  </p>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg text-gray-500">Total</p>
                <CurrencyFormat
                  value={getFinalPrice()}
                  className="text-right font-semibold"
                />
              </div>
              <Button
                onClick={() => router.push("/checkout")}
                variant="outline"
                className="bg-primary-900 dark:bg-primary-500 dark:hover:ring-2 dark:hover:shadow-lg dark:hover:shadow-primary-500/50  dark:ring-primary-500  text-white capitalize cursor-pointer text-lg py-7 px-4 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out"
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
