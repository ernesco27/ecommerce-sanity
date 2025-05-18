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
    type: "stock",
    startDate: format(
      new Date().setDate(new Date().getDate() - 30),
      "yyyy-MM-dd",
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
    format: "csv",
    metrics: ["stock", "movements", "alerts"],
    filters: {
      entityType: "",
      action: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      value: "stock",
      label: "Stock Report",
      metrics: ["stock", "movements", "alerts", "recommendations"],
    },
    {
      value: "sales",
      label: "Sales Analytics",
      metrics: ["revenue", "orders", "products", "trends"],
    },
    {
      value: "customer",
      label: "Customer Analytics",
      metrics: ["engagement", "satisfaction", "demographics", "behavior"],
    },
    {
      value: "order",
      label: "Order Analytics",
      metrics: ["volume", "status", "fulfillment", "returns"],
    },
    {
      value: "audit",
      label: "Audit Log Report",
      metrics: ["actions", "users", "changes", "timestamps"],
    },
  ];

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
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${reportConfig.type}-report-${format(
          new Date(),
          "yyyy-MM-dd",
        )}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        console.log("Report data:", data);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
    setLoading(false);
  };

  const currentReportType = reportTypes.find(
    (rt) => rt.value === reportConfig.type,
  );

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
                  onChange={(e) => {
                    const newType = e.currentTarget.value;
                    const reportType = reportTypes.find(
                      (rt) => rt.value === newType,
                    );
                    setReportConfig({
                      ...reportConfig,
                      type: newType,
                      metrics: reportType?.metrics.slice(0, 3) || [],
                    });
                  }}
                >
                  {reportTypes.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
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

            {currentReportType && (
              <Stack space={3}>
                <Text size={1}>Metrics to Include</Text>
                <Grid columns={3} gap={2}>
                  {currentReportType.metrics.map((metric) => (
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
                  ))}
                </Grid>
              </Stack>
            )}

            <Button
              tone="primary"
              text={loading ? "Generating..." : "Generate Report"}
              onClick={handleGenerateReport}
              disabled={loading}
            />
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
