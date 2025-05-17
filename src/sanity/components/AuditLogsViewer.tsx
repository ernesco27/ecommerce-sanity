import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Text,
  TextInput,
  Select,
  Button,
  Box,
  Flex,
} from "@sanity/ui";
import { format } from "date-fns";
import { useClient } from "sanity";

interface AuditLogChange {
  field: string;
  oldValue: string;
  newValue: string;
}

interface AuditLog {
  timestamp: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "login"
    | "logout"
    | "export"
    | "import"
    | "permission_change";
  entityType:
    | "product"
    | "order"
    | "user"
    | "inventory"
    | "category"
    | "discount"
    | "role"
    | "system";
  entityId?: string;
  userName: string;
  status: "success" | "failed" | "warning";
  changes: AuditLogChange[];
  ipAddress?: string;
  userAgent?: string;
}

interface FilterState {
  startDate: string;
  endDate: string;
  entityType: string;
  action: string;
}

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: format(
      new Date().setDate(new Date().getDate() - 7),
      "yyyy-MM-dd",
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
    entityType: "",
    action: "",
  });
  const [loading, setLoading] = useState(false);

  const client = useClient({ apiVersion: "2023-05-03" });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = '*[_type == "auditLog"';
      const conditions: string[] = [];

      if (filters.startDate) {
        conditions.push(`timestamp >= "${filters.startDate}T00:00:00Z"`);
      }
      if (filters.endDate) {
        conditions.push(`timestamp <= "${filters.endDate}T23:59:59Z"`);
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

      query += `] | order(timestamp desc) {
        timestamp,
        action,
        entityType,
        entityId,
        "userName": coalesce(user->firstName, "") + " " + coalesce(user->lastName, ""),
        status,
        changes,
        ipAddress,
        userAgent
      }`;

      const results = await client.fetch<AuditLog[]>(query);
      setLogs(results);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = () => {
    const csv = [
      // CSV Headers
      [
        "Timestamp",
        "Action",
        "Entity Type",
        "Entity ID",
        "User",
        "Status",
        "IP Address",
        "Changes",
      ].join(","),
      // CSV Data
      ...logs.map((log: AuditLog) =>
        [
          log.timestamp,
          log.action,
          log.entityType,
          log.entityId || "",
          log.userName,
          log.status,
          log.ipAddress || "",
          JSON.stringify(log.changes || []),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card padding={4} tone="transparent">
      <Stack space={4}>
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Filters
            </Text>
            <Flex gap={3}>
              <TextInput
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.currentTarget.value })
                }
              />
              <TextInput
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.currentTarget.value })
                }
              />
              <Select
                value={filters.entityType}
                onChange={(e) =>
                  setFilters({ ...filters, entityType: e.currentTarget.value })
                }
              >
                <option value="">All Entity Types</option>
                <option value="product">Product</option>
                <option value="order">Order</option>
                <option value="user">User</option>
                <option value="inventory">Inventory</option>
              </Select>
              <Select
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.currentTarget.value })
                }
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </Select>
              <Button
                tone="primary"
                onClick={fetchLogs}
                disabled={loading}
                text={loading ? "Loading..." : "Apply Filters"}
              />
              <Button
                tone="positive"
                onClick={handleExport}
                text="Export CSV"
                disabled={loading || logs.length === 0}
              />
            </Flex>
          </Stack>
        </Card>

        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Audit Logs ({logs.length} records)
            </Text>
            {logs.map((log, index) => (
              <Card
                key={index}
                padding={3}
                radius={2}
                tone={log.status === "success" ? "positive" : "critical"}
              >
                <Stack space={2}>
                  <Flex gap={2}>
                    <Text size={1} weight="semibold">
                      {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </Text>
                    <Text size={1}>{log.userName}</Text>
                    <Text size={1} weight="semibold">
                      {log.action.toUpperCase()}
                    </Text>
                    <Text size={1}>{log.entityType}</Text>
                    {log.entityId && <Text size={1}>ID: {log.entityId}</Text>}
                  </Flex>
                  {log.changes && log.changes.length > 0 && (
                    <Box marginTop={2}>
                      <Text size={1} weight="semibold">
                        Changes:
                      </Text>
                      {log.changes.map((change, i) => (
                        <Text key={i} size={1}>
                          {change.field}: {change.oldValue} → {change.newValue}
                        </Text>
                      ))}
                    </Box>
                  )}
                  <Text size={0} muted>
                    IP: {log.ipAddress || "N/A"} | Agent:{" "}
                    {log.userAgent || "N/A"}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
