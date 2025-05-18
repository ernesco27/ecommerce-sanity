import { ActivityIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const auditLogType = defineType({
  name: "auditLog",
  type: "document",
  title: "Audit Logs",
  icon: ActivityIcon,
  fields: [
    defineField({
      name: "timestamp",
      type: "datetime",
      title: "Timestamp",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "action",
      type: "string",
      title: "Action",
      options: {
        list: [
          { title: "Create", value: "create" },
          { title: "Update", value: "update" },
          { title: "Delete", value: "delete" },
          { title: "Login", value: "login" },
          { title: "Logout", value: "logout" },
          { title: "Export", value: "export" },
          { title: "Import", value: "import" },
          { title: "Permission Change", value: "permission_change" },
          { title: "Stock Adjustment", value: "stock_adjustment" },
          {
            title: "Stock Order Fulfillment",
            value: "stock_order_fulfillment",
          },
          { title: "Stock Return", value: "stock_return" },
          { title: "Stock Count", value: "stock_count" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entityType",
      type: "string",
      title: "Entity Type",
      options: {
        list: [
          { title: "Product", value: "product" },
          { title: "Order", value: "order" },
          { title: "User", value: "user" },
          { title: "Inventory", value: "inventory" },
          { title: "Category", value: "category" },
          { title: "Discount", value: "discount" },
          { title: "Role", value: "role" },
          { title: "System", value: "system" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entityId",
      type: "string",
      title: "Entity ID",
      description: "ID of the affected entity",
    }),
    defineField({
      name: "details",
      type: "object",
      title: "Action Details",
      fields: [
        defineField({
          name: "previousValue",
          type: "string",
          title: "Previous Value",
        }),
        defineField({
          name: "newValue",
          type: "string",
          title: "New Value",
        }),
        defineField({
          name: "reason",
          type: "string",
          title: "Reason for Change",
        }),
        defineField({
          name: "relatedOrder",
          type: "reference",
          to: [{ type: "order" }],
          title: "Related Order",
        }),
      ],
    }),
    defineField({
      name: "ipAddress",
      type: "string",
      title: "IP Address",
    }),
    defineField({
      name: "userAgent",
      type: "string",
      title: "User Agent",
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Success", value: "success" },
          { title: "Failed", value: "failed" },
          { title: "Warning", value: "warning" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Additional Notes",
    }),
  ],
  preview: {
    select: {
      title: "action",
      subtitle: "entityType",
      timestamp: "timestamp",
    },
    prepare({ title, subtitle, timestamp }) {
      return {
        title: title || "Unknown Action",
        subtitle: `${subtitle || "Unknown Entity"} - ${new Date(timestamp).toLocaleString()}`,
      };
    },
  },
});
