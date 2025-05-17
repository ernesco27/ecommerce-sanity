import { useState, useEffect } from "react";
import { Card, Stack, Text, TextInput, Grid, Box } from "@sanity/ui";
import { format, subDays } from "date-fns";
import { useClient } from "sanity";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [metrics, setMetrics] = useState<any>({
    pageViews: [],
    productViews: [],
    userActions: [],
  });
  const [loading, setLoading] = useState(false);

  const client = useClient({ apiVersion: "2023-05-03" });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "analytics" && date >= $startDate && date <= $endDate] {
        date,
        "pageViewCount": count(pageViews),
        "productViewCount": count(productViews),
        "userActionCount": count(userActions),
        pageViews[]{
          pageType,
          timestamp
        },
        productViews[]{
          "productName": product->name,
          timestamp
        },
        userActions[]{
          action,
          entityType,
          timestamp
        }
      } | order(date asc)`;

      const results = await client.fetch(query, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      // Process the data for charts
      const processedData = results.map((day: any) => ({
        date: format(new Date(day.date), "MMM dd"),
        pageViews: day.pageViewCount,
        productViews: day.productViewCount,
        userActions: day.userActionCount,
      }));

      // Calculate totals and popular items
      const totals = {
        pageViews: results.reduce(
          (acc: number, curr: any) => acc + curr.pageViewCount,
          0,
        ),
        productViews: results.reduce(
          (acc: number, curr: any) => acc + curr.productViewCount,
          0,
        ),
        userActions: results.reduce(
          (acc: number, curr: any) => acc + curr.userActionCount,
          0,
        ),
      };

      // Get popular pages
      const allPageViews = results.flatMap((day: any) => day.pageViews);
      const pageTypeCounts = allPageViews.reduce((acc: any, view: any) => {
        acc[view.pageType] = (acc[view.pageType] || 0) + 1;
        return acc;
      }, {});

      // Get popular products
      const allProductViews = results.flatMap((day: any) => day.productViews);
      const productCounts = allProductViews.reduce((acc: any, view: any) => {
        acc[view.productName] = (acc[view.productName] || 0) + 1;
        return acc;
      }, {});

      setMetrics({
        chartData: processedData,
        totals,
        popularPages: Object.entries(pageTypeCounts)
          .sort(([, a]: any, [, b]: any) => b - a)
          .slice(0, 5),
        popularProducts: Object.entries(productCounts)
          .sort(([, a]: any, [, b]: any) => b - a)
          .slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  return (
    <Card padding={4} tone="transparent">
      <Stack space={4}>
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Date Range
            </Text>
            <Stack space={3} direction="row">
              <TextInput
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    startDate: e.currentTarget.value,
                  })
                }
              />
              <TextInput
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.currentTarget.value })
                }
              />
            </Stack>
          </Stack>
        </Card>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {/* Overview Cards */}
            <Grid columns={3} gap={3}>
              <Card padding={3} radius={2} shadow={1}>
                <Stack>
                  <Text size={4} weight="bold">
                    {metrics.totals?.pageViews || 0}
                  </Text>
                  <Text size={1}>Total Page Views</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1}>
                <Stack>
                  <Text size={4} weight="bold">
                    {metrics.totals?.productViews || 0}
                  </Text>
                  <Text size={1}>Total Product Views</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1}>
                <Stack>
                  <Text size={4} weight="bold">
                    {metrics.totals?.userActions || 0}
                  </Text>
                  <Text size={1}>Total User Actions</Text>
                </Stack>
              </Card>
            </Grid>

            {/* Activity Chart */}
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={2} weight="semibold">
                  Activity Overview
                </Text>
                <Box style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={metrics.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="pageViews"
                        fill="#8884d8"
                        name="Page Views"
                      />
                      <Bar
                        dataKey="productViews"
                        fill="#82ca9d"
                        name="Product Views"
                      />
                      <Bar
                        dataKey="userActions"
                        fill="#ffc658"
                        name="User Actions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            </Card>

            {/* Popular Items */}
            <Grid columns={2} gap={3}>
              <Card padding={3} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={2} weight="semibold">
                    Popular Pages
                  </Text>
                  {metrics.popularPages?.map(
                    ([pageType, count]: [string, number]) => (
                      <Text key={pageType} size={1}>
                        {pageType}: {count} views
                      </Text>
                    ),
                  )}
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={2} weight="semibold">
                    Popular Products
                  </Text>
                  {metrics.popularProducts?.map(
                    ([product, count]: [string, number]) => (
                      <Text key={product} size={1}>
                        {product}: {count} views
                      </Text>
                    ),
                  )}
                </Stack>
              </Card>
            </Grid>
          </>
        )}
      </Stack>
    </Card>
  );
}
