import { useCallback, useEffect, useState } from "react";
import { Card, Grid, Stack, Text } from "@sanity/ui";
import { client } from "../../lib/client";
import { BaseDashboard } from "./BaseDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SalesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const query = `*[_type == "analytics" && date >= $startDate && date <= $endDate] {
        date,
        salesMetrics {
          totalSales,
          orderCount,
          averageOrderValue,
          topSellingProducts[] {
            "productName": product->name,
            quantity,
            revenue
          }
        }
      } | order(date asc)`;

      const results = await client.fetch(query, { startDate, endDate });

      // Process data for charts
      const processedData = results.map((item: any) => ({
        date: item.date,
        sales: item.salesMetrics?.totalSales || 0,
        orders: item.salesMetrics?.orderCount || 0,
        avgOrderValue: item.salesMetrics?.averageOrderValue || 0,
      }));

      // Calculate totals
      const totals = results.reduce(
        (acc: any, curr: any) => ({
          totalSales:
            (acc.totalSales || 0) + (curr.salesMetrics?.totalSales || 0),
          totalOrders:
            (acc.totalOrders || 0) + (curr.salesMetrics?.orderCount || 0),
          avgOrderValue: curr.salesMetrics?.averageOrderValue || 0, // Latest value
        }),
        {},
      );

      // Get top products across the period
      const allTopProducts = results.flatMap(
        (day: any) => day.salesMetrics?.topSellingProducts || [],
      );

      const topProducts = allTopProducts
        .reduce((acc: any, curr: any) => {
          const existing = acc.find(
            (p: any) => p.productName === curr.productName,
          );
          if (existing) {
            existing.quantity += curr.quantity;
            existing.revenue += curr.revenue;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, [])
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

      setData({
        chartData: processedData,
        totals,
        topProducts,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch sales data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <BaseDashboard title="Sales Analytics" onDateRangeChange={fetchData}>
      {loading ? (
        <Text>Loading sales data...</Text>
      ) : data ? (
        <Stack space={4}>
          {/* Overview Cards */}
          <Grid columns={3} gap={3}>
            <Card padding={3} radius={2} shadow={1} tone="primary">
              <Stack>
                <Text size={4} weight="bold">
                  ${data.totals.totalSales?.toLocaleString()}
                </Text>
                <Text size={1}>Total Sales</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.totalOrders?.toLocaleString()}
                </Text>
                <Text size={1}>Total Orders</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  ${data.totals.avgOrderValue?.toLocaleString()}
                </Text>
                <Text size={1}>Average Order Value</Text>
              </Stack>
            </Card>
          </Grid>

          {/* Sales Chart */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Sales Trend
              </Text>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#6366f1" name="Sales" />
                    <Bar dataKey="orders" fill="#22c55e" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Stack>
          </Card>

          {/* Top Products */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Top Selling Products
              </Text>
              {data.topProducts.map((product: any, index: number) => (
                <Card key={index} padding={3} radius={2} tone="default">
                  <Stack space={2}>
                    <Text weight="semibold">{product.productName}</Text>
                    <Grid columns={2} gap={2}>
                      <Text size={1}>Quantity: {product.quantity}</Text>
                      <Text size={1}>
                        Revenue: ${product.revenue?.toLocaleString()}
                      </Text>
                    </Grid>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>
        </Stack>
      ) : null}
    </BaseDashboard>
  );
}
