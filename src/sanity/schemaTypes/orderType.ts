import { defineType, defineField } from "sanity";

export const orderType = defineType({
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    defineField({
      name: "orderNumber",
      type: "string",
      title: "Order Number",
      readOnly: true,
    }),
    defineField({
      name: "user",
      type: "reference",
      title: "User",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "items",
      type: "array",
      title: "Order Items",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              title: "Product",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "variant",
              type: "object",
              title: "Selected Variant",
              fields: [
                defineField({
                  name: "variantId",
                  type: "string",
                  title: "Variant ID",
                }),
                defineField({
                  name: "color",
                  type: "string",
                  title: "Color",
                }),
                defineField({
                  name: "size",
                  type: "string",
                  title: "Size",
                }),
                defineField({
                  name: "price",
                  type: "number",
                  title: "Price",
                }),
              ],
            }),
            defineField({
              name: "quantity",
              type: "number",
              title: "Quantity",
            }),
            defineField({
              name: "subtotal",
              type: "number",
              title: "Subtotal",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "shippingAddress",
      type: "reference",
      title: "Shipping Address",
      to: [{ type: "address" }],
    }),
    defineField({
      name: "billingAddress",
      type: "reference",
      title: "Billing Address",
      to: [{ type: "address" }],
    }),
    defineField({
      name: "shippingMethod",
      type: "object",
      title: "Shipping Method",
      fields: [
        defineField({
          name: "id",
          type: "string",
          title: "ID",
        }),
        defineField({
          name: "name",
          type: "string",
          title: "Name",
        }),
        defineField({
          name: "price",
          type: "number",
          title: "Price",
        }),
        defineField({
          name: "estimatedDays",
          type: "string",
          title: "Estimated Days",
        }),
      ],
    }),
    defineField({
      name: "paymentMethod",
      type: "object",
      title: "Payment Method",
      fields: [
        defineField({
          name: "type",
          type: "string",
          title: "Type",
          options: {
            list: [
              { title: "Credit Card", value: "card" },
              { title: "PayPal", value: "paypal" },
            ],
          },
        }),
        defineField({
          name: "lastFourDigits",
          type: "string",
          title: "Last Four Digits",
        }),
        defineField({
          name: "cardType",
          type: "string",
          title: "Card Type",
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      type: "number",
      title: "Subtotal",
    }),
    defineField({
      name: "shippingCost",
      type: "number",
      title: "Shipping Cost",
    }),
    defineField({
      name: "tax",
      type: "number",
      title: "Tax",
    }),
    defineField({
      name: "total",
      type: "number",
      title: "Total",
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Order Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentStatus",
      type: "string",
      title: "Payment Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Order Notes",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
      title: "Updated At",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "status",
      total: "total",
    },
    prepare(selection) {
      const { title, subtitle, total } = selection;
      return {
        title: `Order ${title}`,
        subtitle: `${subtitle} - $${total}`,
      };
    },
  },
});
