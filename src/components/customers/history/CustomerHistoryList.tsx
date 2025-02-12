
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { HistoryFilters } from "./components/HistoryFilters";
import { HistoryStatistics } from "./components/HistoryStatistics";
import { HistoryTable } from "./components/HistoryTable";
import { type CustomerHistoryListProps, type HistoryRecord } from "./types";

export function CustomerHistoryList({ customerId }: CustomerHistoryListProps) {
  const [filterField, setFilterField] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: historyRecords, isLoading } = useQuery({
    queryKey: ["customer-history", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_history")
        .select(`
          *,
          profiles:changed_by (
            first_name,
            last_name
          )
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HistoryRecord[];
    },
  });

  const filteredRecords = useMemo(() => {
    if (!historyRecords) return [];
    
    return historyRecords.filter(record => {
      const fieldMatch = filterField === "all" || record.field_name === filterField;
      const typeMatch = filterType === "all" || record.change_type === filterType;
      return fieldMatch && typeMatch;
    });
  }, [historyRecords, filterField, filterType]);

  const uniqueFields = useMemo(() => {
    if (!historyRecords) return [];
    return Array.from(new Set(historyRecords.map(r => r.field_name)));
  }, [historyRecords]);

  const uniqueTypes = useMemo(() => {
    if (!historyRecords) return [];
    return Array.from(new Set(historyRecords.map(r => r.change_type)));
  }, [historyRecords]);

  const statistics = useMemo(() => {
    if (!historyRecords) return null;
    
    const byType = historyRecords.reduce((acc, record) => {
      acc[record.change_type] = (acc[record.change_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byField = historyRecords.reduce((acc, record) => {
      acc[record.field_name] = (acc[record.field_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { byType, byField };
  }, [historyRecords]);

  const handleExport = () => {
    if (!filteredRecords.length) return;

    const csv = [
      ["Date", "Changed By", "Field", "Change Type", "Old Value", "New Value", "Notes"].join(","),
      ...filteredRecords.map(record => [
        format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss"),
        `${record.profiles.first_name} ${record.profiles.last_name}`,
        record.field_name,
        record.change_type,
        record.old_value || "",
        record.new_value || "",
        record.notes || ""
      ].map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("History exported successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <History className="h-4 w-4" />
          <span>Change History</span>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!historyRecords?.length) {
    return (
      <Alert>
        <AlertDescription className="flex items-center justify-center py-4 text-muted-foreground">
          No history records found
        </AlertDescription>
      </Alert>
    );
  }

  // Group records by date
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const date = format(parseISO(record.created_at), "MMMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, HistoryRecord[]>);

  return (
    <div className="space-y-6">
      <HistoryFilters
        filterField={filterField}
        filterType={filterType}
        uniqueFields={uniqueFields}
        uniqueTypes={uniqueTypes}
        onFilterFieldChange={setFilterField}
        onFilterTypeChange={setFilterType}
        onExport={handleExport}
      />

      {statistics && <HistoryStatistics statistics={statistics} />}

      <HistoryTable groupedRecords={groupedRecords} />
    </div>
  );
}
