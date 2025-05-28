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

type CheckoutStep =
  | "information"
  | "shipping"
  | "confirmation"
  | "payment"
  | "thankyou";

interface Step {
  id: CheckoutStep;
  name: string;
}

const steps: readonly Step[] = [
  { id: "information", name: "Information" },
  { id: "shipping", name: "Shipping" },
  { id: "confirmation", name: "Confirmation" },
  { id: "payment", name: "Payment" },
] as const;

interface Address {
  _id?: string;
  fullName: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

interface CheckoutData {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: any;
  orderNumber?: string;
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

  // Validation functions for each step
  const validateInformation = () => {
    console.log("Validating addresses:", {
      shipping: checkoutData.shippingAddress,
      billing: checkoutData.billingAddress,
    });

    if (!checkoutData.shippingAddress || !checkoutData.billingAddress) {
      toast.error("Please provide both shipping and billing addresses");
      return false;
    }

    // Required fields for both shipping and billing addresses
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "addressLine1",
      "city",
      "state",
      "country",
      "phone",
    ];

    // Validate shipping address
    for (const field of requiredFields) {
      if (!checkoutData.shippingAddress[field]) {
        toast.error(
          `Please provide ${field.replace(/([A-Z])/g, " $1").toLowerCase()} for shipping address`,
        );
        return false;
      }
    }

    // Validate billing address
    for (const field of requiredFields) {
      if (!checkoutData.billingAddress[field]) {
        toast.error(
          `Please provide ${field.replace(/([A-Z])/g, " $1").toLowerCase()} for billing address`,
        );
        return false;
      }
    }

    return true;
  };

  const validateShipping = () => {
    if (!checkoutData.shippingMethod) {
      toast.error("Please select a shipping method");
      return false;
    }
    return true;
  };

  const validateConfirmation = () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return false;
    }
    if (
      !checkoutData.shippingAddress ||
      !checkoutData.billingAddress ||
      !checkoutData.shippingMethod
    ) {
      toast.error("Please complete all previous steps");
      return false;
    }
    return true;
  };

  const handleAddressSubmit = (addresses: {
    shipping: Address;
    billing: Address;
  }) => {
    console.log("Received addresses:", addresses);

    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: addresses.shipping,
      billingAddress: addresses.billing,
    }));
  };

  const handleShippingMethodSelect = (method: ShippingMethod) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingMethod: method,
    }));
  };

  const handlePaymentSubmit = async (paymentDetails: any) => {
    setIsProcessing(true);
    try {
      // Process payment here
      setCheckoutData((prev) => ({
        ...prev,
        paymentMethod: paymentDetails,
      }));
      await handleConfirmOrder();
      setCurrentStep("thankyou");
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
            checkoutData.shippingAddress?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order } = await response.json();
      setCheckoutData((prev) => ({
        ...prev,
        orderNumber: order.orderNumber,
      }));

      // Clear the cart
      clearCart();

      toast.success(
        "Order placed successfully! Check your email for confirmation.",
      );

      // Redirect to thank you step
      setCurrentStep("thankyou");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case "information":
        if (validateInformation()) {
          setCurrentStep("shipping");
        }
        break;
      case "shipping":
        if (validateShipping()) {
          setCurrentStep("confirmation");
        }
        break;
      case "confirmation":
        if (validateConfirmation()) {
          setCurrentStep("payment");
        }
        break;
      default:
        break;
    }
  };

  if (items.length === 0 && currentStep !== "thankyou") {
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
            // Only allow going back to previous steps if not processing
            if (!isProcessing) {
              const currentIndex = steps.findIndex((s) => s.id === currentStep);
              const clickedIndex = steps.findIndex((s) => s.id === step);
              if (clickedIndex < currentIndex) {
                setCurrentStep(step as CheckoutStep);
              }
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
              <ShippingMethodSelector
                onSelect={handleShippingMethodSelect}
                selectedMethodId={checkoutData.shippingMethod?._id}
              />
            </div>
          )}

          {currentStep === "confirmation" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Review</h2>
              <OrderSummary
                items={items}
                shippingAddress={checkoutData.shippingAddress}
                billingAddress={checkoutData.billingAddress}
                shippingMethod={checkoutData.shippingMethod!}
                subtotal={getTotalPrice()}
              />
            </div>
          )}

          {currentStep === "payment" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment</h2>
              <PaymentForm
                onSuccess={handlePaymentSubmit}
                onClose={() => setIsProcessing(false)}
                total={
                  getTotalPrice() + (checkoutData.shippingMethod?.price || 0)
                }
                isCreatingOrder={isProcessing}
              />
            </div>
          )}

          {currentStep === "thankyou" && checkoutData.orderNumber && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">
                Thank You for Your Order!
              </h2>
              <p className="text-xl mb-4">Order #{checkoutData.orderNumber}</p>
              <p className="mb-8">
                We've sent a confirmation email with your order details.
              </p>
              <Button onClick={() => router.push("/products")}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        {/* Hide the navigation area during payment and thank you steps */}
        {currentStep !== "payment" && currentStep !== "thankyou" && (
          <div className="mt-8 flex justify-between items-center">
            <div>
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
            </div>

            <div>
              {currentStep === "information" && (
                <Button
                  onClick={handleNextStep}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isProcessing}
                >
                  Continue to Shipping
                </Button>
              )}
              {currentStep === "shipping" && (
                <Button
                  onClick={handleNextStep}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={!checkoutData.shippingMethod || isProcessing}
                >
                  Continue to Confirmation
                </Button>
              )}
              {currentStep === "confirmation" && (
                <Button
                  onClick={handleNextStep}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isProcessing}
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
