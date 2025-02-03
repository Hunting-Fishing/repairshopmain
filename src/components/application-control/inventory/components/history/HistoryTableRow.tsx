import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant, getChangeDescription } from "./utils/badgeUtils";

interface HistoryTableRowProps {
  entry: {
    created_at: string;
    inventory_items?: { name: string } | null;
    change_type: string;
    quantity_change: number | null;
    notes: string | null;
    profiles?: { first_name: string; last_name: string } | null;
  };
}

export function HistoryTableRow({ entry }: HistoryTableRowProps) {
  return (
    <TableRow>
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
  );
}