
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LaborEntry } from "@/types/labor";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

interface LaborListProps {
  laborEntries: LaborEntry[] | undefined;
}

export function LaborList({ laborEntries }: LaborListProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
      error: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getRateTypeColor = (type: string) => {
    const colors = {
      default: "bg-blue-100 text-blue-800",
      overtime: "bg-amber-100 text-amber-800",
      holiday: "bg-green-100 text-green-800",
      custom: "bg-purple-100 text-purple-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Labor entries">
        <TableHeader>
          <TableRow>
            <TableHead>Technician</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rate/Hour</TableHead>
            <TableHead>Rate Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!laborEntries || laborEntries.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={8} 
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
                  {entry.is_timer_running ? (
                    <span className="flex items-center gap-2">
                      <Timer className="h-4 w-4 animate-pulse text-blue-500" />
                      In Progress
                    </span>
                  ) : entry.end_time ? (
                    format(new Date(entry.end_time), 'PPp')
                  ) : (
                    'Not Completed'
                  )}
                </TableCell>
                <TableCell>
                  {entry.actual_duration_minutes ? (
                    <span className="flex flex-col">
                      <span>{formatDuration(entry.actual_duration_minutes)}</span>
                      {entry.estimated_duration_minutes && (
                        <span className="text-xs text-muted-foreground">
                          Est: {formatDuration(entry.estimated_duration_minutes)}
                        </span>
                      )}
                    </span>
                  ) : (
                    'In Progress'
                  )}
                </TableCell>
                <TableCell>${entry.rate_per_hour}/hr</TableCell>
                <TableCell>
                  <Badge className={getRateTypeColor(entry.labor_rate_type)}>
                    {entry.labor_rate_type.replace('_', ' ')}
                  </Badge>
                </TableCell>
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
