"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import CurrencyFormat from "./CurrencyFormat";
import { Loader2 } from "lucide-react";

export interface ShippingMethod {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface ShippingMethodSelectorProps {
  onSelect: (method: ShippingMethod) => void;
  selectedMethodId?: string;
}

export function ShippingMethodSelector({
  onSelect,
  selectedMethodId,
}: ShippingMethodSelectorProps) {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await fetch("/api/shipping-methods");
        if (!response.ok) {
          throw new Error("Failed to fetch shipping methods");
        }
        const data = await response.json();
        setShippingMethods(data);

        // Set initial selection
        if (data.length > 0) {
          const initialMethodId = selectedMethodId || data[0]._id;
          setSelectedMethod(initialMethodId);

          // Call onSelect with the initial method
          const initialMethod = data.find(
            (m: ShippingMethod) => m._id === initialMethodId,
          );
          if (initialMethod) {
            onSelect(initialMethod);
          }
        }
      } catch (err) {
        setError("Unable to load shipping methods. Please try again later.");
        console.error("Error fetching shipping methods:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingMethods();
  }, []); // Remove onSelect from dependencies

  // Effect to handle selectedMethodId changes
  useEffect(() => {
    if (selectedMethodId && selectedMethodId !== selectedMethod) {
      setSelectedMethod(selectedMethodId);
    }
  }, [selectedMethodId]);

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = shippingMethods.find((m) => m._id === methodId);
    if (method) {
      onSelect(method);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800">
        {error}
      </div>
    );
  }

  if (shippingMethods.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-yellow-800">
        No shipping methods are currently available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={handleMethodChange}
        className="space-y-4"
      >
        {shippingMethods.map((method) => (
          <div
            key={method._id}
            className={`flex items-center space-x-4 rounded-lg border p-4 ${
              selectedMethod === method._id
                ? "border-yellow-600 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <RadioGroupItem value={method._id} id={method._id} />
            <Label htmlFor={method._id} className="flex-1 cursor-pointer">
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
    </div>
  );
}
