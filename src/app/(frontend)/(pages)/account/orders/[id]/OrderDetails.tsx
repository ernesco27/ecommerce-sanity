"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
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
import { useOrders } from "@/hooks/orders";
import Container from "@/components/custom/Container";
import CurrencyFormat from "@/components/custom/CurrencyFormat";

import { cn, formatAddress, ShippingAddress } from "@/lib/utils";
import { CompanySettings } from "../../../../../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the PDF Actions component
const OrderPdfActions = lazy(
  () => import("../../../../../../components/sanity/orders/OrderPdfActions"),
);

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  variant: {
    size: string;
    price: number;
    color: string;
  };
  quantity: number;
  subtotal: number;
}

export interface Item {
  _id: string;
  product: {
    _id: string;
    name: string;
    images?: {
      primary?: {
        url: string;
        alt?: string;
      };
    };
  };
  variant: {
    size: string;
    price: number;
    color: string;
  };
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;

  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  user: {
    _id: string;
    name: string;
  };
}

const OrderDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user } = useUser();
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: company, isLoading } = useSWR<CompanySettings>(
    "/api/company",
    fetcher,
  );

  const logoUrl = company?.logo
    ? urlFor(company.logo).url()
    : "/placeholder.png";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orders = await getOrders();

        const sanitizedData: Order[] = orders.map((order: any): Order => {
          const shipAddr = order.shippingAddress;
          // Concatenate user's first and last name
          const userName =
            [order.user?.firstName, order.user?.lastName]
              .filter(Boolean)
              .join(" ") || "N/A";

          return {
            _id: order._id || "missing_id",
            orderNumber: order.orderNumber || "N/A",
            createdAt: order.createdAt || new Date().toISOString(),
            user: {
              _id: order.user?._id || "missing_user_id",
              name: userName,
            },
            items: (order.items || []).map((item: Item) => ({
              product: {
                _id: item?.product?._id || "missing_product_id",
                name: item?.product?.name || "Unknown Product",
                image: item?.product?.images?.primary?.url,
              },

              variant: {
                //variantId: item.variant.variantId,
                color: item.variant.color,
                size: item.variant.size,
                price: item.variant.price,
              },
              quantity: item?.quantity || 0,
              subtotal: item?.subtotal,
            })),
            shippingAddress: {
              _id: shipAddr?._id || "missing_address_id",
              fullName: shipAddr?.fullName,
              addressLine1: shipAddr?.addressLine1,
              addressLine2: shipAddr?.addressLine2,
              city: shipAddr?.city,
              state: shipAddr?.state,
              postalCode: shipAddr?.postalCode,
              country: shipAddr?.country,
              formatted: formatAddress(shipAddr),
            },
            total: order.total || 0,
            status: order.status || "pending",
          };
        });

        setOrders(sanitizedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getOrders]);

  if (loading) {
    return (
      <>
        <Container>
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="w-[120px] h-[50px]" />
            <Skeleton className="w-[120px] h-[50px]" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="w-full h-[150px]" />
            <Skeleton className="w-full h-[150px]" />
          </div>
        </Container>
      </>
    );
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
      <Container className="p-4 lg:p-12 my-4">
        <div className="flex justify-between  items-center mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          <Suspense
            fallback={
              <Button
                variant="ghost"
                size="lg"
                disabled
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer transition-all duration-300"
              >
                Loading PDF Option..
              </Button>
            }
          >
            {!isLoading && order && (
              <OrderPdfActions order={order} logoUrl={logoUrl} />
            )}
            {isLoading && (
              <Button
                variant="ghost"
                size="lg"
                disabled
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer transition-all duration-300"
              >
                Loading Invoice..
              </Button>
            )}
          </Suspense>
        </div>

        <h1 className="text-xl mb-4 lg:text-2xl font-semibold">
          Order #{order?.orderNumber}
        </h1>

        <div className="grid gap-6">
          <Card className="py-4 lg:p-6">
            <CardHeader>
              <CardTitle className="text-xl lg:text-2xl font-semibold">
                Order Summary
              </CardTitle>
              <CardDescription className="text-sm lg:text-md">
                Order details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-md lg:text-lg ">
                <div>
                  <p className="text-md lg:text-lg font-medium text-muted-foreground">
                    Order Date
                  </p>
                  {order?.createdAt && (
                    <p className="mt-1">
                      {format(new Date(order?.createdAt || ""), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-md lg:text-lg font-medium text-muted-foreground">
                    Status
                  </p>
                  {order?.status && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        `text-sm text-white  ${getStatusColor(order?.status || "pending")}`,
                      )}
                    >
                      {order?.status?.charAt(0).toUpperCase() +
                        order?.status?.slice(1)}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-md lg:text-lg font-medium text-muted-foreground">
                    Total Amount
                  </p>

                  {order?.total && (
                    <CurrencyFormat
                      value={order?.total}
                      className="mt-1 text-md lg:text-lg"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="py-4 lg:p-6">
            <CardHeader>
              <CardTitle className="text-xl lg:text-2xl font-semibold">
                Order Items
              </CardTitle>
              <CardDescription className="text-sm lg:text-md">
                Items included in your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-md lg:text-lg">
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
                    <TableRow key={item.product._id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.product?.image || "/placeholder.png"}
                              alt={item.product?.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-md lg:text-lg ">
                              {item.product.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-md lg:text-lg">
                        {item.variant.size}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-md lg:text-lg">
                          {item.variant?.color}
                        </span>
                      </TableCell>
                      <TableCell>
                        <CurrencyFormat
                          value={item.variant.price}
                          className="text-md lg:text-lg"
                        />
                      </TableCell>
                      <TableCell className="text-md lg:text-lg">
                        {item.quantity}
                      </TableCell>
                      <TableCell>
                        <CurrencyFormat
                          value={item.variant.price * item.quantity}
                          className="text-md lg:text-lg"
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
