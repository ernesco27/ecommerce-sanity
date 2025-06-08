import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Card,
  Grid,
  Spinner,
} from "@sanity/ui";
import { format } from "date-fns";
import { Order, OrderItem, ShippingAddress } from "./types";
import { useClient } from "sanity";

import { formatAddress } from "@/lib/utils";

// Dynamically import the PDF Actions component
const OrderPdfActions = lazy(() => import("./OrderPdfActions"));

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [loadingLogo, setLoadingLogo] = useState<boolean>(true);
  const client = useClient();

  useEffect(() => {
    if (isOpen) {
      // Fetch company settings for the logo URL
      const fetchCompanyLogo = async () => {
        setLoadingLogo(true);
        try {
          // Replace with your actual query for company settings
          const companySettings = await client.fetch(
            `*[_type == "companySettings"][0]{ logo { asset->{url} } }`,
          );
          if (companySettings?.logo?.asset?.url) {
            setLogoUrl(companySettings.logo.asset.url);
          }
        } catch (err) {
          console.error("Failed to fetch company logo:", err);
          // Handle error, maybe set a default local logo or none
        }
        setLoadingLogo(false);
      };
      fetchCompanyLogo();
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  return (
    <Dialog
      header="Order Details"
      id="order-details-modal"
      onClose={onClose}
      zOffset={1000}
      width={2}
    >
      <Box padding={4}>
        <Stack space={4}>
          {/* Order Header */}
          <Card padding={3} tone="primary" border>
            <Flex justify="space-between" align="center">
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Order #{order.orderNumber}
                </Text>
                <Text size={1}>
                  Placed on{" "}
                  {order.createdAt
                    ? format(new Date(order.createdAt), "PPP")
                    : "N/A"}
                </Text>
              </Stack>
              <Text size={2} weight="semibold">
                Status:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {order.status}
                </span>
              </Text>
            </Flex>
          </Card>

          {/* Customer Information */}
          <Card padding={3} border>
            <Stack space={4}>
              <Text weight="semibold">Customer Information</Text>
              <Grid columns={2} gap={3}>
                <Stack space={4}>
                  <Text size={2} weight="semibold">
                    Customer Name
                  </Text>
                  <Text size={3}>{order.user?.name || "N/A"}</Text>
                </Stack>
              </Grid>
            </Stack>
          </Card>

          {/* Order Items */}
          <Card padding={3} border>
            <Stack space={3}>
              <Text weight="semibold">Order Items</Text>
              {order.items && order.items.length > 0 ? (
                order.items.map((item: OrderItem, index: number) => (
                  <Card
                    key={index}
                    padding={3}
                    shadow={1}
                    radius={2}
                    marginTop={2}
                  >
                    <Flex justify="space-between">
                      <Stack space={4} style={{ flex: 1 }} padding={2}>
                        <Text size={3} weight="semibold">
                          {item.product?.name || "Unknown Product"}
                        </Text>
                        {item.variant && (
                          <Text
                            size={2}
                            muted
                            style={{ textTransform: "capitalize" }}
                          >
                            Variant:
                            {item.variant.color &&
                              ` Color: ${item.variant.color}`}
                            {item.variant.size &&
                              `, Size: ${item.variant.size}`}
                            {item.variant.price !== undefined &&
                              `, Price: GHs${item.variant.price.toFixed(2)}`}
                          </Text>
                        )}
                        <Text size={2} muted>
                          Quantity: {item.quantity || 0}
                        </Text>
                      </Stack>
                      {item.subtotal !== undefined && (
                        <Text size={2} weight="semibold">
                          Subtotal: GHs{item.subtotal.toFixed(2)}
                        </Text>
                      )}
                    </Flex>
                  </Card>
                ))
              ) : (
                <Text muted>No items in this order.</Text>
              )}
            </Stack>
          </Card>

          {/* Shipping Information */}
          <Card padding={4} border>
            <Stack space={4}>
              <Text weight="semibold">Shipping Information</Text>
              <Text size={2}>
                {order.shippingAddress?.formatted ||
                  formatAddress(order.shippingAddress)}
              </Text>
            </Stack>
          </Card>

          {/* Order Summary */}
          <Card padding={4} border>
            <Stack space={4}>
              <Text weight="semibold">Order Summary</Text>
              <Stack space={2}>
                <Flex justify="space-between">
                  <Text size={2} weight="semibold">
                    Total Amount
                  </Text>
                  <Text size={2} weight="semibold">
                    GHs{(order.total || 0).toFixed(2)}
                  </Text>
                </Flex>
              </Stack>
            </Stack>
          </Card>

          {/* Actions */}
          <Flex justify="flex-end" gap={3} paddingTop={3}>
            <Suspense
              fallback={
                <Button
                  text="Loading PDF Option..."
                  mode="ghost"
                  disabled
                  icon={Spinner}
                />
              }
            >
              {!loadingLogo && (
                <OrderPdfActions order={order} logoUrl={logoUrl} />
              )}
              {loadingLogo && (
                <Button
                  text="Loading Logo..."
                  mode="ghost"
                  disabled
                  icon={Spinner}
                />
              )}
            </Suspense>
            <Button mode="default" text="Close" onClick={onClose} />
          </Flex>
        </Stack>
      </Box>
    </Dialog>
  );
}
