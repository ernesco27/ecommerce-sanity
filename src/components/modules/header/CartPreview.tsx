"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";

const CartPreview = ({
  cartOpen,
  setCartOpen,
  side = "bottom",
}: {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  side?: "bottom" | "right";
}) => {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, getTotalPrice, getTotalItems, hydrated } =
    useCartStore();

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
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            Cart ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full justify-between gap-8">
          <div className="flex flex-col snap-y gap-6 max-h-[360px] border-b border-gray-200 p-4 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item._id}-${item.selectedVariant._id}-${item.selectedVariant.color}`}
                className="flex justify-between gap-4 snap-center "
              >
                {item.selectedVariant.imageUrl && (
                  <div className="relative h-20 w-20">
                    <Image
                      src={item.selectedVariant.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 gap-1">
                  <span className="capitalize text-lg">
                    {item.name.substring(0, 30)}...
                  </span>
                  <div className="inline-flex gap-4 font-bold">
                    <span className="font-semibold text-base">
                      {item.quantity}
                    </span>
                    <span>x</span>
                    <CurrencyFormat
                      value={item.selectedVariant.price}
                      className="font-semibold text-base"
                    />
                  </div>
                  <div className="inline-flex gap-4">
                    <div className="inline-flex gap-1">
                      <span className="text-sm">Size:</span>
                      <span className="font-semibold text-sm">
                        {item.selectedVariant.size}
                      </span>
                    </div>
                    <div className="inline-flex gap-1">
                      <span className="text-sm">Color:</span>
                      <span className="font-semibold text-sm capitalize">
                        {item.selectedVariant.color}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-start"
                  role="button"
                  onClick={() =>
                    handleRemoveItem(item._id, item.selectedVariant._id)
                  }
                >
                  <Trash
                    className="hover:text-red-500 cursor-pointer"
                    size={15}
                  />
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-4">
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between">
              <div className="text-xl font-bold">Subtotal</div>

              <CurrencyFormat value={getTotalPrice()} className="text-right" />
            </div>
            <div className="flex flex-col gap-4">
              <Link
                onClick={() => setCartOpen(false)}
                href="/cart"
                className="rounded-sm py-2 justify-center hover:bg-primary-500 text-center hover:text-white capitalize border border-border text-base transition-all duration-300 ease-in-out"
              >
                View Cart
              </Link>
              <Button
                variant="default"
                size="lg"
                className="rounded-sm py-4 capitalize text-base bg-primary-900 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartPreview;
