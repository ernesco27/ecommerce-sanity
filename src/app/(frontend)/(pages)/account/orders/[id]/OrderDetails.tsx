"use client";

import React, { useEffect, useState } from "react";
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
//import type { Order, OrderItem } from "@/components/modules/account/MyOrders";
import { useOrders } from "@/lib/hooks/orders";
import Container from "@/components/custom/Container";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import PageHeader from "@/components/modules/products/PageHeader";

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: {
      primary: {
        url: string;
        alt: string;
      };
    };
  };
  variant: {
    size: string;
    price: number;
    color: string;
  };
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
}

const OrderDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user } = useUser();
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();

        setOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [getOrders]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view order details.</p>
      </div>
    );
  }

  //   if (error) {
  //     return <div>Failed to load order details</div>;
  //   }

  if (!orders) {
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

  const order = orders.find((order) => order._id === id);

  return (
    <>
      <PageHeader
        heading="Order Details"
        link1="Account"
        link2="Order Details"
      />
      <Container className="p-4 my-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-8 mb-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
            <h1 className="text-2xl font-semibold">
              Order #{order?.orderNumber}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="lg"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer transition-all duration-300"
          >
            Download Invoice
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Order Summary
              </CardTitle>
              <CardDescription className="text-md">
                Order details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg ">
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Order Date
                  </p>
                  {order?.createdAt && (
                    <p className="mt-1">
                      {format(new Date(order?.createdAt || ""), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Status
                  </p>
                  {order?.status && (
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(order?.status || "pending")} text-sm text-white mt-1`}
                    >
                      {order?.status?.charAt(0).toUpperCase() +
                        order?.status?.slice(1)}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Total Amount
                  </p>

                  {order?.total && (
                    <CurrencyFormat value={order?.total} className="mt-1" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Order Items
              </CardTitle>
              <CardDescription className="text-md">
                Items included in your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-lg">
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((item: OrderItem) => (
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
                            <p className="font-medium text-lg ">
                              {item.product.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-lg">
                        {item.variant.size}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-lg">
                          {item.variant?.color}
                        </span>
                      </TableCell>
                      <TableCell>
                        <CurrencyFormat value={item.variant.price} />
                      </TableCell>
                      <TableCell className="text-lg">{item.quantity}</TableCell>
                      <TableCell>
                        <CurrencyFormat
                          value={item.variant.price * item.quantity}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default OrderDetails;
