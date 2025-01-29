import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { History, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryRecord {
  id: string;
  changed_by: string;
  change_type: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  notes: string | null;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface CustomerHistoryListProps {
  customerId: string;
}

export function CustomerHistoryList({ customerId }: CustomerHistoryListProps) {
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

  if (isLoading) {
    return <div className="text-center py-4">Loading history...</div>;
  }

  if (!historyRecords?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No history records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <History className="h-4 w-4" />
        <span>Change History</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {format(new Date(record.created_at), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {record.profiles.first_name} {record.profiles.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="capitalize">
                {record.field_name.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {record.change_type === "create" ? (
                    <span className="text-green-600">Created</span>
                  ) : (
                    <>
                      <div className="text-red-600 line-through">
                        {record.old_value || "(empty)"}
                      </div>
                      <div className="text-green-600">
                        {record.new_value || "(empty)"}
                      </div>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>{record.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}