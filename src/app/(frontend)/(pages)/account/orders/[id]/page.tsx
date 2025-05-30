"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order, OrderItem } from "@/components/modules/account/MyOrders";

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { user } = useUser();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: order, error } = useSWR<Order>(
    user ? `/api/orders/${params.id}` : null,
    fetcher,
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view order details.</p>
      </div>
    );
  }

  if (error) {
    return <div>Failed to load order details</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order details and status</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Order Date
                </p>
                <p className="mt-1">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(order.status)} text-white mt-1`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="mt-1">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Items included in your order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItem) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.product.images.primary.url}
                            alt={item.product.images.primary.alt}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.variant.size}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {item.variant.colorVariant.color}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.variant.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
