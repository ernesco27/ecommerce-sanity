"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/lib/hooks/orders";
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

const MyOrders = () => {
  const { user } = useUser();
  const router = useRouter();
  const { getOrders } = useOrders();

  const [orders, setOrders] = useState<Order[]>([]);

  // const fetcher = async (url: string) => {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch orders");
  //   }
  //   return response.json();
  // };

  // // First get the Sanity user document using Clerk ID
  // const { data: sanityUser, error: userError } = useSWR(
  //   user ? `/api/user/${user.id}` : null,
  //   fetcher,
  // );

  // // Then fetch orders using the Sanity user ID
  // const { data: orders, error: ordersError } = useSWR<Order[]>(
  //   sanityUser?._id ? `/api/orders?userId=${sanityUser._id}` : null,
  //   fetcher,
  // );

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

  // if (userError || ordersError) {
  //   return <div>Failed to load orders</div>;
  // }

  if (!orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Orders</h2>
        <p className="text-sm text-muted-foreground">
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
        <div className="border rounded-lg p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/account/orders/${order._id}`)
                      }
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
