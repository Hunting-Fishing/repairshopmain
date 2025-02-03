import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

  const getChangeDescription = (entry: InventoryHistoryEntry) => {
    switch (entry.change_type) {
      case "create":
        return "Item Added";
      case "update":
        if (entry.quantity_change) {
          return entry.quantity_change > 0
            ? `Quantity Increased by ${entry.quantity_change}`
            : `Quantity Decreased by ${Math.abs(entry.quantity_change)}`;
        }
        return "Details Updated";
      case "delete":
        return "Item Removed";
      default:
        return entry.change_type;
    }
  };

  const getBadgeVariant = (changeType: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (changeType) {
      case "create":
        return "secondary";
      case "update":
        return "default";
      case "delete":
        return "destructive";
      default:
        return "outline";
    }
  };

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
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>{entry.inventory_items?.name || "Unknown Item"}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(entry.change_type)}>
                    {getChangeDescription(entry)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {entry.profiles
                    ? `${entry.profiles.first_name} ${entry.profiles.last_name}`
                    : "System"}
                </TableCell>
                <TableCell>{entry.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}