
import { format } from "date-fns";
import { User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type HistoryTableProps, type HistoryRecord } from "../types";

function getChangeDescription(record: HistoryRecord) {
  if (record.change_type === "create") {
    return <span className="text-green-600">Created</span>;
  }

  return (
    <div className="text-sm">
      <div className="text-red-600 line-through">
        {record.old_value || "(empty)"}
      </div>
      <div className="text-green-600">
        {record.new_value || "(empty)"}
      </div>
    </div>
  );
}

export function HistoryTable({ groupedRecords }: HistoryTableProps) {
  return (
    <>
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
                      <User className="h-4 w-4" />
                      <span>
                        {record.profiles.first_name} {record.profiles.last_name}
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
    </>
  );
}
