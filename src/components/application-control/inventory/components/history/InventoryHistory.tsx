import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryTableRow } from "./HistoryTableRow";

interface InventoryHistoryEntry {
  id: string;
  inventory_item_id: string | null;
  change_type: string;
  quantity_change: number | null;
  old_value: any;
  new_value: any;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  inventory_items: {
    name: string;
  } | null;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

export function InventoryHistory() {
  const { data: history, isLoading } = useQuery({
    queryKey: ["inventory-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_history")
        .select(`
          *,
          inventory_items (name),
          profiles (first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as InventoryHistoryEntry[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Modified By</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history?.map((entry) => (
              <HistoryTableRow key={entry.id} entry={entry} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}