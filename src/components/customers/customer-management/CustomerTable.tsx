import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleRowClick(customer.id)}
          >
            <TableCell>
              {customer.first_name} {customer.last_name}
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone_number}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(customer)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}