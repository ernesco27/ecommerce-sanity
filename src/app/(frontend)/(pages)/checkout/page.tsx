"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Container from "@/components/custom/Container";
import { Steps } from "@/components/custom/Steps";
import UserAddress from "@/components/custom/UserAddress";
import {
  ShippingMethodSelector,
  type ShippingMethod,
} from "@/components/custom/ShippingMethodSelector";
import { PaymentForm } from "@/components/custom/PaymentForm";
import { OrderSummary } from "@/components/custom/OrderSummary";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CheckoutStep = "information" | "shipping" | "payment" | "confirmation";

interface Step {
  id: CheckoutStep;
  name: string;
}

const steps: readonly Step[] = [
  { id: "information", name: "Information" },
  { id: "shipping", name: "Shipping" },
  { id: "payment", name: "Payment" },
  { id: "confirmation", name: "Confirmation" },
] as const;

interface CheckoutData {
  shippingAddress: any;
  billingAddress: any;
  shippingMethod: ShippingMethod | null;
  paymentMethod: any;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: null,
    billingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
  });

  const handleAddressSubmit = (addresses: { shipping: any; billing: any }) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: addresses.shipping,
      billingAddress: addresses.billing,
    }));
    setCurrentStep("shipping");
  };

  const handleShippingMethodSelect = (method: ShippingMethod) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingMethod: method,
    }));
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (paymentMethod: any) => {
    setIsProcessing(true);
    try {
      // TODO: Implement payment processing with Stripe or other payment provider
      setCheckoutData((prev) => ({
        ...prev,
        paymentMethod,
      }));
      setCurrentStep("confirmation");
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress: checkoutData.shippingAddress,
          billingAddress: checkoutData.billingAddress,
          shippingMethod: checkoutData.shippingMethod,
          paymentMethod: checkoutData.paymentMethod,
          subtotal: getTotalPrice(),
          total: getTotalPrice() + (checkoutData.shippingMethod?.price || 0),
          customerEmail:
            user?.emailAddresses[0]?.emailAddress ||
            checkoutData.shippingAddress.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order } = await response.json();

      // Clear the cart
      clearCart();

      toast.success(
        "Order placed successfully! Check your email for confirmation.",
      );

      // Redirect to order confirmation page
      router.push(`/orders/${order.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-8">
        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step: string) => {
            // Only allow going back to previous steps
            const currentIndex = steps.findIndex((s) => s.id === currentStep);
            const clickedIndex = steps.findIndex((s) => s.id === step);
            if (clickedIndex < currentIndex) {
              setCurrentStep(step as CheckoutStep);
            }
          }}
        />

        <div className="mt-8">
          {currentStep === "information" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <UserAddress onSubmit={handleAddressSubmit} />
            </div>
          )}

          {currentStep === "shipping" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
              <ShippingMethodSelector onSelect={handleShippingMethodSelect} />
            </div>
          )}

          {currentStep === "payment" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment</h2>
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                total={
                  getTotalPrice() + (checkoutData.shippingMethod?.price || 0)
                }
              />
            </div>
          )}

          {currentStep === "confirmation" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Confirmation</h2>
              <OrderSummary
                items={items}
                shippingAddress={checkoutData.shippingAddress}
                billingAddress={checkoutData.billingAddress}
                shippingMethod={checkoutData.shippingMethod!}
                subtotal={getTotalPrice()}
              />
              <Button
                onClick={handleConfirmOrder}
                className="w-full mt-6"
                disabled={isProcessing}
              >
                Confirm Order
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          {currentStep !== "information" && (
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = steps.findIndex(
                  (s) => s.id === currentStep,
                );
                setCurrentStep(steps[currentIndex - 1].id as CheckoutStep);
              }}
              disabled={isProcessing}
            >
              Back
            </Button>
          )}

          {currentStep !== "confirmation" && currentStep !== "payment" && (
            <Button
              className="ml-auto"
              disabled={isProcessing}
              onClick={() => {
                // This is temporary until we implement the actual step handlers
                const currentIndex = steps.findIndex(
                  (s) => s.id === currentStep,
                );
                setCurrentStep(steps[currentIndex + 1].id as CheckoutStep);
              }}
            >
              Continue to{" "}
              {steps[steps.findIndex((s) => s.id === currentStep) + 1]?.name}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
