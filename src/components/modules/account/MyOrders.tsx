"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/orders";
import Container from "@/components/custom/Container";
import CurrencyFormat from "@/components/custom/CurrencyFormat";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { User } from "../../../../sanity.types";
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
    colorVariant: {
      color: string;
    };
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

const MyOrders = ({ user }: { user: User }) => {
  const router = useRouter();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {
    data: orders,
    error,
    isLoading,
  } = useSWR(user ? `/api/orders?userId=${user._id}` : null, fetcher);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center">
        <Loader2 className=" w-10 h-10  animate-spin text-primary-500" />
      </Container>
    );
  }

  return (
    <div className="space-y-6 w-[90%] mx-auto">
      <div>
        <h2 className="text-lg lg:text-2xl font-semibold tracking-tight">
          My Orders
        </h2>
        <p className="text-sm lg:text-lg text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You haven't placed any orders yet.
          </p>
          <Button className="mt-4" onClick={() => router.push("/products")}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 ">
          <Table>
            <TableHeader>
              <TableRow className=" lg:text-lg">
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium lg:text-lg">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="lg:text-lg">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(order.status)} text-white lg:text-lg`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CurrencyFormat
                      value={order.total}
                      className="text-md lg:text-lg"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/account/orders/${order._id}`)
                      }
                      className="cursor-pointer hover:bg-primary-500 hover:text-white transition-all duration-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
