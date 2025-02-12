
import { format } from "date-fns";
import { History } from "lucide-react";
import { HistoryEntry, useCustomerHistory } from "../hooks/useCustomerHistory";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomerHistoryListProps {
  customerId: string;
}

function getChangeDescription(entry: HistoryEntry) {
  const oldValue = entry.old_value || "(empty)";
  const newValue = entry.new_value || "(empty)";

  if (entry.change_type === "create") {
    return <span className="text-green-600">Created</span>;
  }

  return (
    <div className="text-sm">
      <div className="text-red-600 line-through">{oldValue}</div>
      <div className="text-green-600">{newValue}</div>
    </div>
  );
}

export function CustomerHistoryList({ customerId }: CustomerHistoryListProps) {
  const { historyEntries, isLoading } = useCustomerHistory(customerId);

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

  if (!historyEntries?.length) {
    return (
      <Alert>
        <AlertDescription className="flex items-center justify-center py-4 text-muted-foreground">
          No history records found
        </AlertDescription>
      </Alert>
    );
  }

  // Group records by date
  const groupedRecords = historyEntries.reduce((groups, record) => {
    const date = format(new Date(record.created_at), "MMMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, HistoryEntry[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedRecords).map(([date, records]) => (
        <div key={date} className="space-y-2">
          <h3 className="font-medium text-muted-foreground">{date}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {format(new Date(record.created_at), "h:mm a")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>
                        {record.profiles?.first_name} {record.profiles?.last_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.field_name.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{getChangeDescription(record)}</TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
