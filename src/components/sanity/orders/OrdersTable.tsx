import {
  Box,
  Card,
  Flex,
  Text,
  Button,
  Stack,
  Spinner,
  Select,
} from "@sanity/ui";
import React, {
  useCallback,
  useState,
  useEffect,
  Suspense,
  LazyExoticComponent,
} from "react";
import { useClient } from "sanity";
import { format } from "date-fns";

import { Order, OrderItem, ShippingAddress } from "./types";
import OrderDetailsModal from "./OrderDetailsModal";

type SortField = "createdAt" | "orderNumber" | "total" | "status";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

// Helper function to format address (can be moved to a utils file)
const formatAddress = (
  addr: Partial<ShippingAddress> | null | undefined,
): string => {
  if (!addr) return "N/A";
  const parts = [
    addr.fullName,
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.postalCode,
    addr.country,
  ].filter(Boolean); // Filter out null/undefined/empty strings
  return parts.join(", ") || "N/A";
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const client = useClient();

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const baseFilter = `_type == "order"${statusFilter !== "all" ? ` && status == "${statusFilter}"` : ""}`;

      // Get total count for pagination
      const count = await client.fetch(`count(*[${baseFilter}])`);
      setTotalOrders(count);

      // Fetch paginated data
      const start = currentPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      const query = `*[${baseFilter}] | order(${sortField} ${sortOrder}) [${start}...${end}] {
        _id,
        orderNumber,
        createdAt,
        "user": user->{
          _id,
          "name": coalesce(firstName, lastName, "N/A")
        },
        items[]{
          "product": product->{_id, name},
          variant,
          quantity,
          subtotal
        },
        "shippingAddress": shippingAddress->{
          _id,
          fullName,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country
        },
        total,
        status
      }`;

      const rawData = await client.fetch(query);

      // Ensure all required fields are present and handle null values
      const sanitizedData: Order[] = rawData.map((order: any): Order => {
        const shipAddr = order.shippingAddress;
        return {
          _id: order._id || "missing_id",
          orderNumber: order.orderNumber || "N/A",
          createdAt: order.createdAt || new Date().toISOString(),
          user: {
            _id: order.user?._id || "missing_user_id",
            name: order.user?.name || "N/A",
          },
          items: (order.items || []).map(
            (item: any): OrderItem => ({
              product: {
                _id: item?.product?._id || "missing_product_id",
                name: item?.product?.name || "Unknown Product",
              },
              variant: item?.variant
                ? {
                    variantId: item.variant.variantId,
                    color: item.variant.color,
                    size: item.variant.size,
                    price: item.variant.price,
                  }
                : undefined,
              quantity: item?.quantity || 0,
              subtotal: item?.subtotal,
            }),
          ),
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching orders",
      );
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, [client, sortField, sortOrder, statusFilter, currentPage]);

  // Fetch orders on component mount and when sort/filter/page changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(0); // Reset to first page when sorting changes
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);
  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < totalPages - 1;

  if (error) {
    return (
      <Card padding={4} tone="critical">
        <Stack space={3}>
          <Text>Error: {error}</Text>
          <Button text="Retry" onClick={fetchOrders} />
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text size={4} weight="bold">
            Orders
          </Text>

          <Flex gap={2}>
            <Select
              value={statusFilter}
              onChange={(event) =>
                handleFilterChange(event.currentTarget.value)
              }
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </Select>
          </Flex>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" padding={5}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("createdAt")}
                    >
                      Date{" "}
                      {sortField === "createdAt" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("orderNumber")}
                    >
                      Order No.{" "}
                      {sortField === "orderNumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Info
                    </th>
                    <th
                      className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("total")}
                    >
                      Total{" "}
                      {sortField === "total" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("status")}
                    >
                      Status{" "}
                      {sortField === "status" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          {order.createdAt
                            ? format(new Date(order.createdAt), "MMM dd, yyyy")
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          {order.user?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          {order.shippingAddress?.formatted || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          ${(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          <span
                            className={`px-2 inline-flex text-md leading-5 font-semibold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                          <Flex gap={2}>
                            <Button
                              mode="ghost"
                              text="View"
                              onClick={() => handleViewOrder(order)}
                            />
                          </Flex>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Flex justify="space-between" align="center" padding={3}>
              <Text size={1}>
                Showing {currentPage * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalOrders)} of{" "}
                {totalOrders} orders
              </Text>
              <Flex gap={2}>
                <Button
                  mode="ghost"
                  text="Previous"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!canPreviousPage}
                />
                <Text size={1}>
                  Page {currentPage + 1} of {totalPages}
                </Text>
                <Button
                  mode="ghost"
                  text="Next"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!canNextPage}
                />
              </Flex>
            </Flex>
          </>
        )}
      </Stack>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </Card>
  );
}
