import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StaffTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Hire Date</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
  );
}