import { useCallback, useState } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export function OrderDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const query = `*[_type == "analytics" && date >= $startDate && date <= $endDate] {
        date,
        orderMetrics {
          totalOrders,
          averageOrderValue,
          orderStatus[] {
            status,
            count
          },
          ordersByCategory[] {
            category,
            count,
            revenue
          },
          fulfillmentTime,
          returnRate
        }
      } | order(date asc)`;

      const results = await client.fetch(query, { startDate, endDate });

      // Process data for charts
      const processedData = results.map((item: any) => ({
        date: item.date,
        orders: item.orderMetrics?.totalOrders || 0,
        avgValue: item.orderMetrics?.averageOrderValue || 0,
        fulfillmentTime: item.orderMetrics?.fulfillmentTime || 0,
      }));

      // Calculate totals and aggregates
      const totals = results.reduce(
        (acc: any, curr: any) => ({
          totalOrders:
            (acc.totalOrders || 0) + (curr.orderMetrics?.totalOrders || 0),
          avgOrderValue: curr.orderMetrics?.averageOrderValue || 0, // Latest value
          avgFulfillmentTime: curr.orderMetrics?.fulfillmentTime || 0, // Latest value
          returnRate: curr.orderMetrics?.returnRate || 0, // Latest value
        }),
        {},
      );

      // Aggregate order statuses
      const orderStatuses = results
        .flatMap((day: any) => day.orderMetrics?.orderStatus || [])
        .reduce((acc: any, curr: any) => {
          const existing = acc.find((s: any) => s.status === curr.status);
          if (existing) {
            existing.count += curr.count;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, [])
        .sort((a: any, b: any) => b.count - a.count);

      // Aggregate orders by category
      const ordersByCategory = results
        .flatMap((day: any) => day.orderMetrics?.ordersByCategory || [])
        .reduce((acc: any, curr: any) => {
          const existing = acc.find((c: any) => c.category === curr.category);
          if (existing) {
            existing.count += curr.count;
            existing.revenue += curr.revenue;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, [])
        .sort((a: any, b: any) => b.revenue - a.revenue);

      setData({
        chartData: processedData,
        totals,
        orderStatuses,
        ordersByCategory,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch order data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <BaseDashboard title="Order Analytics" onDateRangeChange={fetchData}>
      {loading ? (
        <Text>Loading order data...</Text>
      ) : data ? (
        <Stack space={4}>
          {/* Overview Cards */}
          <Grid columns={4} gap={3}>
            <Card padding={3} radius={2} shadow={1} tone="primary">
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
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.avgFulfillmentTime?.toFixed(1)} days
                </Text>
                <Text size={1}>Avg. Fulfillment Time</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.returnRate?.toFixed(1)}%
                </Text>
                <Text size={1}>Return Rate</Text>
              </Stack>
            </Card>
          </Grid>

          {/* Orders Trend Chart */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Orders Trend
              </Text>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#6366f1" name="Orders" />
                    <Bar
                      dataKey="avgValue"
                      fill="#22c55e"
                      name="Average Value"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Stack>
          </Card>

          <Grid columns={2} gap={3}>
            {/* Order Status Distribution */}
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Order Status Distribution
                </Text>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data.orderStatuses}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.orderStatuses.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Stack>
            </Card>

            {/* Orders by Category */}
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Top Categories by Revenue
                </Text>
                {data.ordersByCategory.map((category: any, index: number) => (
                  <Card key={index} padding={3} radius={2} tone="default">
                    <Stack space={2}>
                      <Text weight="semibold">{category.category}</Text>
                      <Grid columns={2} gap={2}>
                        <Text size={1}>Orders: {category.count}</Text>
                        <Text size={1}>
                          Revenue: ${category.revenue?.toLocaleString()}
                        </Text>
                      </Grid>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Stack>
      ) : null}
    </BaseDashboard>
  );
}
