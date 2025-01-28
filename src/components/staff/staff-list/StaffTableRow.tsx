import { format } from "date-fns";
import { User, Calendar } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffContactInfo } from "./StaffContactInfo";

interface StaffTableRowProps {
  staff: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    role: string;
    hire_date: string | null;
    status: string | null;
    custom_roles: {
      name: string | null;
    } | null;
  };
}

export function StaffTableRow({ staff }: StaffTableRowProps) {
  return (
    <TableRow key={staff.id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>
            {staff.first_name} {staff.last_name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <StaffContactInfo email={staff.email} phoneNumber={staff.phone_number} />
      </TableCell>
      <TableCell>
        {staff.role === "custom" ? staff.custom_roles?.name : staff.role.replace("_", " ")}
      </TableCell>
      <TableCell>
        {staff.hire_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {format(new Date(staff.hire_date), "PP")}
            </span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={staff.status === "active" ? "default" : "secondary"}>
          {staff.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}