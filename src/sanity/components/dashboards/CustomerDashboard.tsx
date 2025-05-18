import { useCallback, useState } from "react";
import { Card, Grid, Stack, Text } from "@sanity/ui";
import { client } from "../../lib/client";
import { BaseDashboard } from "./BaseDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CustomerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const query = `*[_type == "analytics" && date >= $startDate && date <= $endDate] {
        date,
        userMetrics {
          newUsers,
          activeUsers,
          conversionRate,
          userEngagement {
            productViews,
            addToCart,
            wishlistAdds,
            reviews,
            averageSessionDuration,
            bounceRate
          }
        }
      } | order(date asc)`;

      const results = await client.fetch(query, { startDate, endDate });

      // Process data for charts
      const processedData = results.map((item: any) => ({
        date: item.date,
        newUsers: item.userMetrics?.newUsers || 0,
        activeUsers: item.userMetrics?.activeUsers || 0,
        conversionRate: item.userMetrics?.conversionRate || 0,
        ...item.userMetrics?.userEngagement,
      }));

      // Calculate totals and averages
      const totals = results.reduce(
        (acc: any, curr: any) => ({
          totalNewUsers:
            (acc.totalNewUsers || 0) + (curr.userMetrics?.newUsers || 0),
          totalActiveUsers:
            (acc.totalActiveUsers || 0) + (curr.userMetrics?.activeUsers || 0),
          avgConversionRate: curr.userMetrics?.conversionRate || 0, // Latest value
          engagement: {
            totalViews:
              (acc.engagement?.totalViews || 0) +
              (curr.userMetrics?.userEngagement?.productViews || 0),
            totalCarts:
              (acc.engagement?.totalCarts || 0) +
              (curr.userMetrics?.userEngagement?.addToCart || 0),
            totalWishlists:
              (acc.engagement?.totalWishlists || 0) +
              (curr.userMetrics?.userEngagement?.wishlistAdds || 0),
            totalReviews:
              (acc.engagement?.totalReviews || 0) +
              (curr.userMetrics?.userEngagement?.reviews || 0),
            avgSessionDuration:
              curr.userMetrics?.userEngagement?.averageSessionDuration || 0,
            avgBounceRate: curr.userMetrics?.userEngagement?.bounceRate || 0,
          },
        }),
        { engagement: {} },
      );

      setData({
        chartData: processedData,
        totals,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customer data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <BaseDashboard title="Customer Analytics" onDateRangeChange={fetchData}>
      {loading ? (
        <Text>Loading customer data...</Text>
      ) : data ? (
        <Stack space={4}>
          {/* Overview Cards */}
          <Grid columns={3} gap={3}>
            <Card padding={3} radius={2} shadow={1} tone="primary">
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.totalNewUsers?.toLocaleString()}
                </Text>
                <Text size={1}>New Users</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.totalActiveUsers?.toLocaleString()}
                </Text>
                <Text size={1}>Active Users</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack>
                <Text size={4} weight="bold">
                  {data.totals.avgConversionRate?.toFixed(2)}%
                </Text>
                <Text size={1}>Conversion Rate</Text>
              </Stack>
            </Card>
          </Grid>

          {/* User Growth Chart */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                User Growth Trend
              </Text>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#6366f1"
                      name="New Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#22c55e"
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Stack>
          </Card>

          {/* Engagement Metrics */}
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                User Engagement
              </Text>
              <Grid columns={3} gap={3}>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.totalViews?.toLocaleString()}
                    </Text>
                    <Text size={1}>Product Views</Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.totalCarts?.toLocaleString()}
                    </Text>
                    <Text size={1}>Add to Cart</Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.totalWishlists?.toLocaleString()}
                    </Text>
                    <Text size={1}>Wishlist Adds</Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.totalReviews?.toLocaleString()}
                    </Text>
                    <Text size={1}>Reviews</Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.avgSessionDuration?.toFixed(2)}s
                    </Text>
                    <Text size={1}>Avg. Session Duration</Text>
                  </Stack>
                </Card>
                <Card padding={3} radius={2}>
                  <Stack>
                    <Text size={2} weight="bold">
                      {data.totals.engagement.avgBounceRate?.toFixed(2)}%
                    </Text>
                    <Text size={1}>Bounce Rate</Text>
                  </Stack>
                </Card>
              </Grid>
            </Stack>
          </Card>
        </Stack>
      ) : null}
    </BaseDashboard>
  );
}
