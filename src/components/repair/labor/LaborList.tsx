
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LaborEntry } from "@/types/labor";
import { Badge } from "@/components/ui/badge";

interface LaborListProps {
  laborEntries: LaborEntry[] | undefined;
}

export function LaborList({ laborEntries }: LaborListProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      "in_progress": "bg-blue-500",
      completed: "bg-green-500",
      error: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Labor entries">
        <TableHeader>
          <TableRow>
            <TableHead>Technician</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Rate/Hour</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!laborEntries || laborEntries.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="text-center"
                aria-label="No labor entries available"
              >
                No labor entries yet
              </TableCell>
            </TableRow>
          ) : (
            laborEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.technician.first_name} {entry.technician.last_name}
                </TableCell>
                <TableCell>{format(new Date(entry.start_time), 'PPp')}</TableCell>
                <TableCell>
                  {entry.end_time ? format(new Date(entry.end_time), 'PPp') : 'In Progress'}
                </TableCell>
                <TableCell>${entry.rate_per_hour}/hr</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(entry.status)}>
                    {entry.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{entry.notes}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
