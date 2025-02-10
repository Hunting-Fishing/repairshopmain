
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Labor {
  id: string;
  technician_id: string;
  start_time: string;
  end_time: string | null;
  rate_per_hour: number;
  notes: string;
  technician: {
    first_name: string;
    last_name: string;
  };
}

interface LaborListProps {
  laborEntries: Labor[] | undefined;
}

export function LaborList({ laborEntries }: LaborListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Rate/Hour</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!laborEntries || laborEntries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No labor entries yet</TableCell>
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
              <TableCell>{entry.notes}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
