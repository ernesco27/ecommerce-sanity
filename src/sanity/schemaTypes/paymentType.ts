import { defineField } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

export const paymentType = {
  name: "payment",
  title: "Payments",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Credit Card", value: "credit_card" },
          { title: "PayPal", value: "paypal" },
          { title: "Bank Transfer", value: "bank_transfer" },
          { title: "Cash on Delivery", value: "cod" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Completed", value: "completed" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
    }),
    defineField({
      name: "paymentDate",
      title: "Payment Date",
      type: "datetime",
    }),
    defineField({
      name: "notes",
      title: "Payment Notes",
      type: "text",
    }),
  ],
};
