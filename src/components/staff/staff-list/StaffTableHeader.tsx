import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface StaffTableHeaderProps {
  onSort: (field: 'name' | 'role' | 'skills') => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

export function StaffTableHeader({ onSort, sortField, sortOrder }: StaffTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort('name')}
            className="h-8 p-0 font-medium"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort('role')}
            className="h-8 p-0 font-medium"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Skills</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}