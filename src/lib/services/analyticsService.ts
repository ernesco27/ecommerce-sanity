import { createClient } from "@sanity/client";
import { format } from "date-fns";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2023-05-03",
});

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackPageView(data: {
    userId?: string;
    pageUrl: string;
    pageType: string;
    duration?: number;
    referrer?: string;
  }) {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const pageView = {
        _type: "pageView",
        timestamp: new Date().toISOString(),
        user: data.userId
          ? { _type: "reference", _ref: data.userId }
          : undefined,
        pageUrl: data.pageUrl,
        pageType: data.pageType,
        duration: data.duration,
        referrer: data.referrer,
      };

      await this.updateDailyAnalytics(today, "pageViews", pageView);
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  async trackProductView(data: {
    userId?: string;
    productId: string;
    duration?: number;
  }) {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const productView = {
        _type: "productView",
        timestamp: new Date().toISOString(),
        user: data.userId
          ? { _type: "reference", _ref: data.userId }
          : undefined,
        product: { _type: "reference", _ref: data.productId },
        duration: data.duration,
      };

      await this.updateDailyAnalytics(today, "productViews", productView);
    } catch (error) {
      console.error("Failed to track product view:", error);
    }
  }

  async trackUserAction(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: any;
  }) {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const userAction = {
        _type: "userAction",
        timestamp: new Date().toISOString(),
        user: { _type: "reference", _ref: data.userId },
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details,
      };

      await this.updateDailyAnalytics(today, "userActions", userAction);
    } catch (error) {
      console.error("Failed to track user action:", error);
    }
  }

  private async updateDailyAnalytics(
    date: string,
    metricType: string,
    data: any,
  ) {
    const analyticsId = `analytics-${date}`;

    try {
      // Try to get existing analytics document
      const existingDoc = await sanityClient.getDocument(analyticsId);

      if (existingDoc) {
        // Update existing document
        await sanityClient
          .patch(analyticsId)
          .setIfMissing({ [metricType]: [] })
          .append(metricType, [data])
          .commit();
      } else {
        // Create new document
        await sanityClient.create({
          _id: analyticsId,
          _type: "analytics",
          date: date,
          [metricType]: [data],
        });
      }
    } catch (error) {
      console.error(`Failed to update ${metricType}:`, error);
    }
  }

  async generateReport(options: {
    startDate: string;
    endDate: string;
    metrics: string[];
    format?: "json" | "csv";
  }): Promise<any> {
    try {
      const query = this.buildAnalyticsQuery(options);
      const results = await sanityClient.fetch(query);

      return options.format === "csv"
        ? this.convertToCSV(results)
        : this.formatReport(results);
    } catch (error) {
      console.error("Failed to generate report:", error);
      throw error;
    }
  }

  private buildAnalyticsQuery(options: any): string {
    const { startDate, endDate, metrics } = options;

    let query = `*[_type == "analytics" && date >= "${startDate}" && date <= "${endDate}"]`;

    if (metrics && metrics.length > 0) {
      query += ` { date, ${metrics.join(", ")} }`;
    }

    query += " | order(date asc)";
    return query;
  }

  private formatReport(data: any[]): any {
    return {
      generatedAt: new Date().toISOString(),
      period: {
        start: data[0]?.date,
        end: data[data.length - 1]?.date,
      },
      totalRecords: data.length,
      data: data,
    };
  }

  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return "";

    // Get all possible headers from all objects
    const headers = new Set<string>();
    data.forEach((obj) => {
      Object.keys(obj).forEach((key) => headers.add(key));
    });

    const headerRow = Array.from(headers).join(",");
    const rows = data.map((obj) => {
      return Array.from(headers)
        .map((header) => {
          const value = obj[header];
          return typeof value === "object" ? JSON.stringify(value) : value;
        })
        .join(",");
    });

    return [headerRow, ...rows].join("\n");
  }
}
