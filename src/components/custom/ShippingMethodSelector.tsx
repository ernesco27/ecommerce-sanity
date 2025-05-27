"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CurrencyFormat from "./CurrencyFormat";

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const defaultShippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Standard shipping with tracking",
    price: 5.99,
    estimatedDays: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Faster delivery with priority handling",
    price: 14.99,
    estimatedDays: "2-3 business days",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next day delivery for urgent orders",
    price: 29.99,
    estimatedDays: "1 business day",
  },
];

interface ShippingMethodSelectorProps {
  onSelect: (method: ShippingMethod) => void;
  shippingMethods?: ShippingMethod[];
}

export function ShippingMethodSelector({
  onSelect,
  shippingMethods = defaultShippingMethods,
}: ShippingMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(
    shippingMethods[0].id,
  );

  const handleContinue = () => {
    const method = shippingMethods.find((m) => m.id === selectedMethod);
    if (method) {
      onSelect(method);
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={setSelectedMethod}
        className="space-y-4"
      >
        {shippingMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center space-x-4 rounded-lg border p-4 ${
              selectedMethod === method.id
                ? "border-yellow-600 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                  <p className="text-sm text-gray-500">
                    {method.estimatedDays}
                  </p>
                </div>
                <div className="text-right">
                  <CurrencyFormat
                    value={method.price}
                    className="font-medium text-gray-900"
                  />
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button onClick={handleContinue} className="w-full">
        Continue with{" "}
        {shippingMethods.find((m) => m.id === selectedMethod)?.name}
      </Button>
    </div>
  );
}
