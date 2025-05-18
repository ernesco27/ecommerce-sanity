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
      name: "pageViews",
      type: "array",
      title: "Page Views",
      of: [
        {
          type: "object",
          fields: [
            { name: "timestamp", type: "datetime" },
            { name: "pageUrl", type: "string" },
            { name: "pageType", type: "string" },
            { name: "duration", type: "number" },
            { name: "referrer", type: "string" },
            {
              name: "user",
              type: "reference",
              to: [{ type: "user" }],
              weak: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "productViews",
      type: "array",
      title: "Product Views",
      of: [
        {
          type: "object",
          fields: [
            { name: "timestamp", type: "datetime" },
            { name: "duration", type: "number" },
            {
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "user",
              type: "reference",
              to: [{ type: "user" }],
              weak: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "userActions",
      type: "array",
      title: "User Actions",
      of: [
        {
          type: "object",
          fields: [
            { name: "timestamp", type: "datetime" },
            {
              name: "action",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "entityType",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "entityId",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "details",
              type: "object",
              fields: [
                { name: "value", type: "number" },
                { name: "currency", type: "string" },
                { name: "quantity", type: "number" },
                { name: "variant", type: "string" },
                { name: "source", type: "string" },
                {
                  name: "metadata",
                  type: "object",
                  fields: [
                    { name: "browser", type: "string" },
                    { name: "device", type: "string" },
                    { name: "platform", type: "string" },
                  ],
                },
              ],
            },
            {
              name: "user",
              type: "reference",
              to: [{ type: "user" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
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
            { name: "averageSessionDuration", type: "number" },
            { name: "bounceRate", type: "number" },
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
        defineField({
          name: "stockMovements",
          type: "object",
          title: "Stock Movements",
          fields: [
            defineField({
              name: "totalIn",
              type: "number",
              title: "Total Stock In",
            }),
            defineField({
              name: "totalOut",
              type: "number",
              title: "Total Stock Out",
            }),
            defineField({
              name: "orderFulfillments",
              type: "number",
              title: "Order Fulfillments",
            }),
            defineField({
              name: "returns",
              type: "number",
              title: "Returns",
            }),
            defineField({
              name: "adjustments",
              type: "number",
              title: "Adjustments",
            }),
          ],
        }),
        defineField({
          name: "topMovers",
          type: "array",
          title: "Top Moving Products",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "product",
                  type: "reference",
                  to: [{ type: "product" }],
                  title: "Product",
                }),
                defineField({
                  name: "quantityMoved",
                  type: "number",
                  title: "Quantity Moved",
                }),
                defineField({
                  name: "revenue",
                  type: "number",
                  title: "Revenue Generated",
                }),
                defineField({
                  name: "movement",
                  type: "string",
                  title: "Movement Type",
                  options: {
                    list: [
                      { title: "High Sales", value: "high_sales" },
                      { title: "Low Sales", value: "low_sales" },
                      { title: "No Movement", value: "no_movement" },
                    ],
                  },
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "warehouseBreakdown",
          type: "array",
          title: "Warehouse Breakdown",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "warehouse",
                  type: "reference",
                  to: [{ type: "warehouse" }],
                  title: "Warehouse",
                }),
                defineField({
                  name: "totalStock",
                  type: "number",
                  title: "Total Stock",
                }),
                defineField({
                  name: "stockValue",
                  type: "number",
                  title: "Stock Value",
                }),
                defineField({
                  name: "utilization",
                  type: "number",
                  title: "Space Utilization %",
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "alerts",
          type: "array",
          title: "Stock Alerts",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "type",
                  type: "string",
                  title: "Alert Type",
                  options: {
                    list: [
                      { title: "Low Stock", value: "low_stock" },
                      { title: "Out of Stock", value: "out_of_stock" },
                      { title: "Overstock", value: "overstock" },
                      { title: "Expiring Soon", value: "expiring_soon" },
                    ],
                  },
                }),
                defineField({
                  name: "product",
                  type: "reference",
                  to: [{ type: "product" }],
                  title: "Product",
                }),
                defineField({
                  name: "message",
                  type: "text",
                  title: "Alert Message",
                }),
                defineField({
                  name: "severity",
                  type: "string",
                  title: "Severity",
                  options: {
                    list: [
                      { title: "Low", value: "low" },
                      { title: "Medium", value: "medium" },
                      { title: "High", value: "high" },
                    ],
                  },
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "recommendations",
          type: "array",
          title: "Stock Recommendations",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "type",
                  type: "string",
                  title: "Recommendation Type",
                  options: {
                    list: [
                      { title: "Restock", value: "restock" },
                      { title: "Reduce Stock", value: "reduce_stock" },
                      { title: "Relocate", value: "relocate" },
                      { title: "Review Pricing", value: "review_pricing" },
                    ],
                  },
                }),
                defineField({
                  name: "product",
                  type: "reference",
                  to: [{ type: "product" }],
                  title: "Product",
                }),
                defineField({
                  name: "suggestion",
                  type: "text",
                  title: "Suggestion",
                }),
                defineField({
                  name: "potentialImpact",
                  type: "string",
                  title: "Potential Impact",
                  options: {
                    list: [
                      { title: "Low", value: "low" },
                      { title: "Medium", value: "medium" },
                      { title: "High", value: "high" },
                    ],
                  },
                }),
              ],
            },
          ],
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
      pageViews: "pageViews",
      productViews: "productViews",
      userActions: "userActions",
    },
    prepare(selection) {
      const {
        date,
        pageViews = [],
        productViews = [],
        userActions = [],
      } = selection;
      return {
        title: new Date(date).toLocaleDateString(),
        subtitle: `Page Views: ${pageViews.length} | Product Views: ${productViews.length} | User Actions: ${userActions.length}`,
      };
    },
  },
});
