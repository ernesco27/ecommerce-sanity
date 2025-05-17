import { LineChartIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const analyticsType = defineType({
  name: "analytics",
  type: "document",
  title: "Analytics",
  icon: LineChartIcon,
  fields: [
    defineField({
      name: "date",
      type: "date",
      title: "Date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "salesMetrics",
      type: "object",
      title: "Sales Metrics",
      fields: [
        defineField({
          name: "totalSales",
          type: "number",
          title: "Total Sales",
        }),
        defineField({
          name: "orderCount",
          type: "number",
          title: "Number of Orders",
        }),
        defineField({
          name: "averageOrderValue",
          type: "number",
          title: "Average Order Value",
        }),
        defineField({
          name: "topSellingProducts",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "product",
                  type: "reference",
                  to: [{ type: "product" }],
                },
                { name: "quantity", type: "number" },
                { name: "revenue", type: "number" },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "userMetrics",
      type: "object",
      title: "User Metrics",
      fields: [
        defineField({
          name: "newUsers",
          type: "number",
          title: "New Users",
        }),
        defineField({
          name: "activeUsers",
          type: "number",
          title: "Active Users",
        }),
        defineField({
          name: "conversionRate",
          type: "number",
          title: "Conversion Rate",
        }),
        defineField({
          name: "userEngagement",
          type: "object",
          fields: [
            { name: "productViews", type: "number" },
            { name: "addToCart", type: "number" },
            { name: "wishlistAdds", type: "number" },
            { name: "reviews", type: "number" },
          ],
        }),
      ],
    }),
    defineField({
      name: "inventoryMetrics",
      type: "object",
      title: "Inventory Metrics",
      fields: [
        defineField({
          name: "totalStock",
          type: "number",
          title: "Total Stock Value",
        }),
        defineField({
          name: "lowStockItems",
          type: "number",
          title: "Low Stock Items",
        }),
        defineField({
          name: "outOfStockItems",
          type: "number",
          title: "Out of Stock Items",
        }),
        defineField({
          name: "stockTurnoverRate",
          type: "number",
          title: "Stock Turnover Rate",
        }),
      ],
    }),
    defineField({
      name: "marketingMetrics",
      type: "object",
      title: "Marketing Metrics",
      fields: [
        defineField({
          name: "campaignPerformance",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "campaignName", type: "string" },
                { name: "clicks", type: "number" },
                { name: "conversions", type: "number" },
                { name: "revenue", type: "number" },
              ],
            },
          ],
        }),
        defineField({
          name: "discountUsage",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "discount",
                  type: "reference",
                  to: [{ type: "discount" }],
                },
                { name: "usageCount", type: "number" },
                { name: "revenue", type: "number" },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "customerServiceMetrics",
      type: "object",
      title: "Customer Service Metrics",
      fields: [
        defineField({
          name: "returns",
          type: "number",
          title: "Returns",
        }),
        defineField({
          name: "refunds",
          type: "number",
          title: "Refunds",
        }),
        defineField({
          name: "customerSatisfaction",
          type: "number",
          title: "Customer Satisfaction Score",
        }),
        defineField({
          name: "supportTickets",
          type: "number",
          title: "Support Tickets",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      date: "date",
      sales: "salesMetrics.totalSales",
    },
    prepare(selection) {
      const { date, sales } = selection;
      return {
        title: new Date(date).toLocaleDateString(),
        subtitle: `Total Sales: $${sales?.toLocaleString() || 0}`,
      };
    },
  },
});
