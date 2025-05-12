"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
//import CurrencyFormat from "@/components/custom/CurrencyFormat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
//import { useCartStore } from "@/store/cartStore";

const CartPreview = ({
  cartOpen,
  setCartOpen,
  side = "bottom",
  cartItemsCount = 0,
}: {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  side?: "bottom" | "right";
  cartItemsCount?: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  // const { items, removeItem, getTotalPrice } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemoveItem = (productId: number) => {
    // removeItem(productId);
  };

  const handleCheckout = () => {
    console.log("checkout");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={side}>
        <SheetHeader className="mb-6 ">
          <SheetTitle className="text-xl font-bold">
            Cart ({/* {items.length} */})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full justify-between gap-8 py-8">
          {/* <div className="flex flex-col snap-y gap-6 max-h-[360px] border-b border-gray-200 pb-4 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.id}-${JSON.stringify(item.selectedVariants)}`}
                className="flex justify-between gap-4 snap-center cursor-grab"
              >
                <Image
                  src={item.selectedImage || item.images[0]?.link}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="h-20 w-20 object-cover"
                />
                <div className="flex flex-col flex-1 gap-1">
                  <span className="capitalize text-lg">{item.name}</span>
                  <div className="inline-flex gap-4 font-bold">
                    <span className="font-semibold text-base">
                      {item.quantity}
                    </span>
                    <span>x</span>
                    <CurrencyFormat
                      value={parseFloat(
                        (item.salesPrice || item.price).toString(),
                      )}
                      className="font-semibold text-base"
                    />
                  </div>
                  {item.selectedVariants &&
                    item.selectedVariants.length > 0 && (
                      <div className="inline-flex gap-4">
                        {item.selectedVariants.map((variant, index) => (
                          <div key={index} className="inline-flex gap-1">
                            <span className="text-sm">{variant.name}:</span>
                            <span className="font-semibold text-sm">
                              {variant.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <div
                  className="flex items-start"
                  role="button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash className="hover:text-primary-500" size={15} />
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-4">
                <p>Your cart is empty</p>
              </div>
            )}
          </div> */}

          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="text-xl font-bold">Subtotal</div>
              <strong>
                {/* <CurrencyFormat
                  value={getTotalPrice()}
                  className="text-right"
                /> */}
              </strong>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/cart"
                className="rounded-sm py-4 justify-center hover:bg-primary-500 text-center hover:text-white capitalize border border-border text-base"
              >
                View Cart
              </Link>
              <Button
                variant="default"
                size="lg"
                className="rounded-sm py-8 capitalize text-base"
                onClick={handleCheckout}
                // disabled={items.length === 0}
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
