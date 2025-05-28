"use client";

import { ShippingMethod } from "./ShippingMethodSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CurrencyFormat from "./CurrencyFormat";

interface OrderSummaryProps {
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    selectedVariant: {
      _id: string;
      price: number;
      color: string;
      size: string;
      imageUrl?: string;
    };
  }>;
  shippingAddress: any;
  billingAddress: any;
  shippingMethod: ShippingMethod;
  subtotal: number;
}

export function OrderSummary({
  items,
  shippingAddress,
  billingAddress,
  shippingMethod,
  subtotal,
}: OrderSummaryProps) {
  const total = subtotal + shippingMethod.price;

  return (
    <div className="space-y-6 ">
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item._id}-${item.selectedVariant._id}`}
                  className="flex justify-between"
                >
                  <div className="flex gap-4">
                    {item.selectedVariant.imageUrl && (
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item.selectedVariant.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.selectedVariant.color} /{" "}
                        {item.selectedVariant.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <CurrencyFormat
                    value={item.selectedVariant.price * item.quantity}
                    className="font-medium text-md lg:text-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <div className="text-sm text-gray-500">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && (
                <p>{shippingAddress.addressLine2}</p>
              )}
              <p>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div>
            <h3 className="font-semibold mb-4">Billing Address</h3>
            <div className="text-sm text-gray-500">
              <p>{billingAddress.fullName}</p>
              <p>{billingAddress.addressLine1}</p>
              {billingAddress.addressLine2 && (
                <p>{billingAddress.addressLine2}</p>
              )}
              <p>
                {billingAddress.city}, {billingAddress.state}{" "}
                {billingAddress.postalCode}
              </p>
              <p>{billingAddress.country}</p>
              <p>{billingAddress.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Shipping Method */}
          <div>
            <h3 className="font-semibold mb-4">Shipping Method</h3>
            <div className="text-sm text-gray-500">
              <p>{shippingMethod.name}</p>
              <p>{shippingMethod.description}</p>
              <p>Estimated delivery: {shippingMethod.estimatedDays}</p>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <CurrencyFormat value={subtotal} className="font-medium" />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <CurrencyFormat
                value={shippingMethod.price}
                className="font-medium"
              />
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <CurrencyFormat value={total} className="font-semibold" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
