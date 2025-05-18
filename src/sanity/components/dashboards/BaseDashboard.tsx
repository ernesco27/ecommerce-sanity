import { useState } from "react";
import { Card, Stack, Text, TextInput } from "@sanity/ui";
import { format, subDays } from "date-fns";

interface BaseDashboardProps {
  title: string;
  children: React.ReactNode;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

export function BaseDashboard({
  title,
  children,
  onDateRangeChange,
}: BaseDashboardProps) {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    onDateRangeChange?.(newDateRange.startDate, newDateRange.endDate);
  };

  return (
    <Card padding={4} tone="transparent">
      <Stack space={4}>
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              {title}
            </Text>
            <Stack space={3} direction="row">
              <TextInput
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleDateChange("startDate", e.currentTarget.value)
                }
              />
              <TextInput
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleDateChange("endDate", e.currentTarget.value)
                }
              />
            </Stack>
          </Stack>
        </Card>
        {children}
      </Stack>
    </Card>
  );
}
