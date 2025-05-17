import { NextRequest, NextResponse } from "next/server";
import { AuditService } from "@/lib/services/auditService";
import { AnalyticsService } from "@/lib/services/analyticsService";

export async function POST(request: NextRequest) {
  try {
    const {
      reportType,
      startDate,
      endDate,
      format = "json",
      filters = {},
    } = await request.json();

    let reportData;

    switch (reportType) {
      case "audit":
        const auditService = AuditService.getInstance();
        reportData = await auditService.generateAuditReport({
          startDate,
          endDate,
          ...filters,
        });
        break;

      case "analytics":
        const analyticsService = AnalyticsService.getInstance();
        reportData = await analyticsService.generateReport({
          startDate,
          endDate,
          metrics: filters.metrics || [
            "pageViews",
            "productViews",
            "userActions",
          ],
          format,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 },
        );
    }

    if (format === "csv") {
      // Return CSV file
      const csvContent =
        typeof reportData === "string" ? reportData : convertToCSV(reportData);

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${reportType}-${startDate}-${endDate}.csv`,
        },
      });
    }

    // Return JSON response
    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}

function convertToCSV(data: any): string {
  if (typeof data !== "object" || !data) return "";

  // Flatten nested objects
  const flatten = (obj: any, prefix = ""): any => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flatten(obj[k], pre + k));
      } else {
        acc[pre + k] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k];
      }
      return acc;
    }, {});
  };

  // Convert array of objects to CSV
  if (Array.isArray(data)) {
    const flattenedData = data.map((item) => flatten(item));
    const headers = Array.from(
      new Set(flattenedData.flatMap((item) => Object.keys(item))),
    );

    const rows = [
      headers.join(","),
      ...flattenedData.map((item) =>
        headers
          .map((header) => {
            const value = item[header];
            return value === undefined ? "" : JSON.stringify(value);
          })
          .join(","),
      ),
    ];

    return rows.join("\n");
  }

  // Convert single object to CSV
  const flattenedData = flatten(data);
  const headers = Object.keys(flattenedData);
  const rows = [
    headers.join(","),
    headers.map((header) => JSON.stringify(flattenedData[header])).join(","),
  ];

  return rows.join("\n");
}
