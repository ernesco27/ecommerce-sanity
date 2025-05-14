import { defineField } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const orderType = {
  name: "order",
  title: "Orders",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "orderItem" }] }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "reference",
      to: [{ type: "address" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "reference",
      to: [{ type: "address" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentInfo",
      title: "Payment Information",
      type: "reference",
      to: [{ type: "payment" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shippingMethod",
      title: "Shipping Method",
      type: "reference",
      to: [{ type: "shippingMethod" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderNotes",
      title: "Order Notes",
      type: "text",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
};
