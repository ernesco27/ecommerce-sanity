import { useState } from "react";
import {
  Card,
  Stack,
  Text,
  TextInput,
  Select,
  Button,
  Box,
  Grid,
} from "@sanity/ui";
import { format } from "date-fns";

export function ReportGenerator() {
  const [reportConfig, setReportConfig] = useState({
    type: "audit",
    startDate: format(
      new Date().setDate(new Date().getDate() - 30),
      "yyyy-MM-dd",
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
    format: "csv",
    metrics: ["pageViews", "productViews", "userActions"],
    filters: {
      entityType: "",
      action: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: reportConfig.type,
          startDate: reportConfig.startDate,
          endDate: reportConfig.endDate,
          format: reportConfig.format,
          filters: {
            ...reportConfig.filters,
            metrics: reportConfig.metrics,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      if (reportConfig.format === "csv") {
        // Handle CSV download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${reportConfig.type}-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Handle JSON display
        const data = await response.json();
        console.log("Report data:", data);
        // You could add state to display this data in the UI
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
    setLoading(false);
  };

  return (
    <Card padding={4} tone="transparent">
      <Stack space={4}>
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Generate Custom Report
            </Text>

            <Grid columns={2} gap={3}>
              <Stack space={3}>
                <Text size={1}>Report Type</Text>
                <Select
                  value={reportConfig.type}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
                      type: e.currentTarget.value,
                    })
                  }
                >
                  <option value="audit">Audit Log Report</option>
                  <option value="analytics">Analytics Report</option>
                </Select>
              </Stack>

              <Stack space={3}>
                <Text size={1}>Output Format</Text>
                <Select
                  value={reportConfig.format}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
                      format: e.currentTarget.value,
                    })
                  }
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </Select>
              </Stack>
            </Grid>

            <Grid columns={2} gap={3}>
              <Stack space={3}>
                <Text size={1}>Start Date</Text>
                <TextInput
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
                      startDate: e.currentTarget.value,
                    })
                  }
                />
              </Stack>

              <Stack space={3}>
                <Text size={1}>End Date</Text>
                <TextInput
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
                      endDate: e.currentTarget.value,
                    })
                  }
                />
              </Stack>
            </Grid>

            {reportConfig.type === "analytics" && (
              <Stack space={3}>
                <Text size={1}>Metrics to Include</Text>
                <Grid columns={3} gap={2}>
                  {["pageViews", "productViews", "userActions"].map(
                    (metric) => (
                      <Box key={metric}>
                        <label>
                          <input
                            type="checkbox"
                            checked={reportConfig.metrics.includes(metric)}
                            onChange={(e) => {
                              const metrics = e.currentTarget.checked
                                ? [...reportConfig.metrics, metric]
                                : reportConfig.metrics.filter(
                                    (m) => m !== metric,
                                  );
                              setReportConfig({ ...reportConfig, metrics });
                            }}
                          />{" "}
                          {metric}
                        </label>
                      </Box>
                    ),
                  )}
                </Grid>
              </Stack>
            )}

            {reportConfig.type === "audit" && (
              <Grid columns={2} gap={3}>
                <Stack space={3}>
                  <Text size={1}>Entity Type</Text>
                  <Select
                    value={reportConfig.filters.entityType}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        filters: {
                          ...reportConfig.filters,
                          entityType: e.currentTarget.value,
                        },
                      })
                    }
                  >
                    <option value="">All Types</option>
                    <option value="product">Product</option>
                    <option value="order">Order</option>
                    <option value="user">User</option>
                    <option value="inventory">Inventory</option>
                  </Select>
                </Stack>

                <Stack space={3}>
                  <Text size={1}>Action Type</Text>
                  <Select
                    value={reportConfig.filters.action}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        filters: {
                          ...reportConfig.filters,
                          action: e.currentTarget.value,
                        },
                      })
                    }
                  >
                    <option value="">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                  </Select>
                </Stack>
              </Grid>
            )}

            <Button
              tone="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              text={loading ? "Generating..." : "Generate Report"}
            />
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
