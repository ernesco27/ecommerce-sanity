import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN, // Need write access
  useCdn: false, // We need real-time data
  apiVersion: "2023-05-03",
});

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async logActivity(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
  }) {
    try {
      const logEntry = {
        _type: "auditLog",
        _id: `audit-${uuidv4()}`,
        timestamp: new Date().toISOString(),
        user: {
          _type: "reference",
          _ref: data.userId,
        },
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        ipAddress: await this.getClientIP(),
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "server",
        status: "success",
        changes: data.details ? this.formatChanges(data.details) : undefined,
      };

      await sanityClient.create(logEntry);
      return true;
    } catch (error) {
      console.error("Failed to log activity:", error);
      return false;
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "unknown";
    }
  }

  private formatChanges(
    details: any,
  ): Array<{ field: string; oldValue: string; newValue: string }> {
    if (!details.previousValue || !details.newValue) return [];

    const changes: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }> = [];
    const fields = Object.keys(details.newValue);

    fields.forEach((field) => {
      const oldValue = details.previousValue[field];
      const newValue = details.newValue[field];
      if (oldValue !== newValue) {
        changes.push({
          field,
          oldValue: String(oldValue),
          newValue: String(newValue),
        });
      }
    });

    return changes;
  }

  async generateAuditReport(filters: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    entityType?: string;
    action?: string;
  }): Promise<any> {
    const query = this.buildAuditQuery(filters);
    try {
      const results = await sanityClient.fetch(query);
      return this.formatAuditReport(results);
    } catch (error) {
      console.error("Failed to generate audit report:", error);
      throw error;
    }
  }

  private buildAuditQuery(filters: any): string {
    let query = '*[_type == "auditLog"';
    const conditions = [];

    if (filters.startDate) {
      conditions.push(`timestamp >= "${filters.startDate}"`);
    }
    if (filters.endDate) {
      conditions.push(`timestamp <= "${filters.endDate}"`);
    }
    if (filters.userId) {
      conditions.push(`user._ref == "${filters.userId}"`);
    }
    if (filters.entityType) {
      conditions.push(`entityType == "${filters.entityType}"`);
    }
    if (filters.action) {
      conditions.push(`action == "${filters.action}"`);
    }

    if (conditions.length > 0) {
      query += ` && ${conditions.join(" && ")}`;
    }

    query += "] | order(timestamp desc)";
    return query;
  }

  private formatAuditReport(data: any[]): any {
    return {
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      records: data.map((record) => ({
        timestamp: record.timestamp,
        action: record.action,
        entityType: record.entityType,
        entityId: record.entityId,
        user: record.user._ref,
        status: record.status,
        changes: record.changes,
      })),
    };
  }
}
