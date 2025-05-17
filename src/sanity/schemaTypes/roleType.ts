import { ShieldUser } from "lucide-react";
import { defineField, defineType } from "sanity";

export const roleType = defineType({
  name: "role",
  type: "document",
  title: "Roles",
  icon: ShieldUser,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Role Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      type: "string",
      title: "Role Code",
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "permissions",
      type: "object",
      title: "Permissions",
      fields: [
        defineField({
          name: "products",
          type: "object",
          title: "Product Permissions",
          fields: [
            { name: "create", type: "boolean", title: "Create Products" },
            { name: "read", type: "boolean", title: "View Products" },
            { name: "update", type: "boolean", title: "Edit Products" },
            { name: "delete", type: "boolean", title: "Delete Products" },
            { name: "publish", type: "boolean", title: "Publish Products" },
          ],
        }),
        defineField({
          name: "orders",
          type: "object",
          title: "Order Permissions",
          fields: [
            { name: "view", type: "boolean", title: "View Orders" },
            { name: "process", type: "boolean", title: "Process Orders" },
            { name: "refund", type: "boolean", title: "Issue Refunds" },
            { name: "cancel", type: "boolean", title: "Cancel Orders" },
          ],
        }),
        defineField({
          name: "users",
          type: "object",
          title: "User Permissions",
          fields: [
            { name: "create", type: "boolean", title: "Create Users" },
            { name: "read", type: "boolean", title: "View Users" },
            { name: "update", type: "boolean", title: "Edit Users" },
            { name: "delete", type: "boolean", title: "Delete Users" },
          ],
        }),
        defineField({
          name: "discounts",
          type: "object",
          title: "Discount Permissions",
          fields: [
            { name: "create", type: "boolean", title: "Create Discounts" },
            { name: "read", type: "boolean", title: "View Discounts" },
            { name: "update", type: "boolean", title: "Edit Discounts" },
            { name: "delete", type: "boolean", title: "Delete Discounts" },
          ],
        }),
        defineField({
          name: "content",
          type: "object",
          title: "Content Permissions",
          fields: [
            { name: "manage_pages", type: "boolean", title: "Manage Pages" },
            {
              name: "manage_banners",
              type: "boolean",
              title: "Manage Banners",
            },
            {
              name: "manage_categories",
              type: "boolean",
              title: "Manage Categories",
            },
          ],
        }),
        defineField({
          name: "reports",
          type: "object",
          title: "Report Permissions",
          fields: [
            {
              name: "view_sales",
              type: "boolean",
              title: "View Sales Reports",
            },
            {
              name: "view_inventory",
              type: "boolean",
              title: "View Inventory Reports",
            },
            {
              name: "view_customers",
              type: "boolean",
              title: "View Customer Reports",
            },
            { name: "export_data", type: "boolean", title: "Export Reports" },
          ],
        }),
      ],
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "code",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled Role",
        subtitle: subtitle ? `Code: ${subtitle}` : "",
      };
    },
  },
});
