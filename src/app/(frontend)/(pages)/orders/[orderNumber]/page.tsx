"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/custom/Container";
import { OrderSummary } from "@/components/custom/OrderSummary";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  orderNumber: string;
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
  shippingMethod: {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
  };
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const query = `*[_type == "order" && orderNumber == $orderNumber][0]{
          _id,
          orderNumber,
          items[]{
            _type,
            product->{
              _id,
              name,
              "imageUrl": images[0].asset->url
            },
            variant,
            quantity,
            subtotal
          },
          shippingAddress->{
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phone
          },
          billingAddress->{
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phone
          },
          shippingMethod,
          subtotal,
          total,
          status,
          createdAt
        }`;

        const result = await client.fetch<Order>(query, { orderNumber });

        if (!result) {
          throw new Error("Order not found");
        }

        // Transform the data to match the OrderSummary component's expected format
        const transformedOrder = {
          ...result,
          items: result.items.map((item: any) => ({
            _id: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            selectedVariant: {
              _id: item.variant.variantId,
              price: item.variant.price,
              color: item.variant.color,
              size: item.variant.size,
              imageUrl: item.product.imageUrl,
            },
          })),
        };

        setOrder(transformedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load order",
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Order not found"}
          </h1>
          <Button onClick={() => (window.location.href = "/products")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">
            Order #{order.orderNumber} was placed successfully.
          </p>
          <p className="text-gray-600">
            We'll send you a confirmation email with your order details.
          </p>
        </div>

        <OrderSummary
          items={order.items}
          shippingAddress={order.shippingAddress}
          billingAddress={order.billingAddress}
          shippingMethod={order.shippingMethod}
          subtotal={order.subtotal}
        />

        <div className="mt-8 flex justify-center">
          <Button onClick={() => (window.location.href = "/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </Container>
  );
}
