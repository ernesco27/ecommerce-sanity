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

export function StockDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const query = `*[_type == "analytics" && date >= $startDate && date <= $endDate] {
        date,
        inventoryMetrics {
          totalStock,
          lowStockItems,
          outOfStockItems,
          stockTurnoverRate,
          stockMovements {
            totalIn,
            totalOut,
            orderFulfillments,
            returns,
            adjustments
          },
          warehouseBreakdown[] {
            "warehouseName": warehouse->name,
            totalStock,
            stockValue,
            utilization
          }
        }
      } | order(date asc)`;

      const results = await client.fetch(query, { startDate, endDate });

      // Process data for charts
      const processedData = results.map((item: any) => ({
        date: item.date,
        totalStock: item.inventoryMetrics?.totalStock || 0,
        lowStock: item.inventoryMetrics?.lowStockItems || 0,
        outOfStock: item.inventoryMetrics?.outOfStockItems || 0,
        turnoverRate: item.inventoryMetrics?.stockTurnoverRate || 0,
      }));

      // Calculate totals and latest values
      const totals = results.reduce(
        (acc: any, curr: any) => ({
          totalStock: curr.inventoryMetrics?.totalStock || 0, // Latest value
          lowStockItems: curr.inventoryMetrics?.lowStockItems || 0, // Latest value
          outOfStockItems: curr.inventoryMetrics?.outOfStockItems || 0, // Latest value
          stockTurnoverRate: curr.inventoryMetrics?.stockTurnoverRate || 0, // Latest value
          stockMovements: curr.inventoryMetrics?.stockMovements || {}, // Latest value
        }),
        {},
      );

      // Get latest warehouse breakdown
      const latestWarehouseData =
        results[results.length - 1]?.inventoryMetrics?.warehouseBreakdown || [];

      setData({
        chartData: processedData,
        totals,
        warehouseData: latestWarehouseData,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch stock data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <BaseDashboard title="Stock Analytics" onDateRangeChange={fetchData}>
      {loading ? (
        <Text>Loading stock data...</Text>
      ) : data ? (
        <Stack space={4}>
          {/* Overview Cards */}
          <Grid columns={4} gap={3}>
            <Card padding={3} radius={2} shadow={1} tone="primary">
              <Stack>
                <Text size={4} weight="bold">
                  ${data.totals.totalStock?.toLocaleString()}
                </Text>
                <Text size={1}>Total Stock Value</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1} tone="caution">
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.lowStockItems}
                </Text>
                <Text size={1}>Low Stock Items</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1} tone="critical">
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.outOfStockItems}
                </Text>
                <Text size={1}>Out of Stock Items</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1} tone="positive">
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.stockTurnoverRate?.toFixed(2)}
                </Text>
                <Text size={1}>Stock Turnover Rate</Text>
              </Stack>
            </Card>
          </Grid>

          {/* Stock Trend Chart */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Stock Trend
              </Text>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalStock"
                      fill="#6366f1"
                      name="Total Stock"
                    />
                    <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" />
                    <Bar
                      dataKey="outOfStock"
                      fill="#ef4444"
                      name="Out of Stock"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Stack>
          </Card>

          <Grid columns={2} gap={3}>
            {/* Stock Movements */}
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Stock Movements
                </Text>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={Object.entries(data.totals.stockMovements).map(
                          ([key, value]: [string, any], index: number) => ({
                            name: key
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .toLowerCase(),
                            value: value,
                          }),
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {Object.keys(data.totals.stockMovements).map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Stack>
            </Card>

            {/* Warehouse Breakdown */}
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Warehouse Breakdown
                </Text>
                {data.warehouseData.map((warehouse: any, index: number) => (
                  <Card key={index} padding={3} radius={2} tone="default">
                    <Stack space={2}>
                      <Text weight="semibold">{warehouse.warehouseName}</Text>
                      <Grid columns={3} gap={2}>
                        <Text size={1}>
                          Stock: {warehouse.totalStock?.toLocaleString()}
                        </Text>
                        <Text size={1}>
                          Value: ${warehouse.stockValue?.toLocaleString()}
                        </Text>
                        <Text size={1}>
                          Utilization: {warehouse.utilization?.toFixed(1)}%
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
