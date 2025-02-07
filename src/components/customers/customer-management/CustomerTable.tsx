
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
import { Skeleton } from "@/components/ui/skeleton";

export interface Customer {
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
  isLoading?: boolean;
}

export function CustomerTable({ customers, onEdit, onDelete, isLoading }: CustomerTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
          <TableHead className="font-semibold text-gray-700">Name</TableHead>
          <TableHead className="font-semibold text-gray-700">Email</TableHead>
          <TableHead className="font-semibold text-gray-700">Phone</TableHead>
          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            className="cursor-pointer transition-all duration-200 hover:bg-[#FDE1D3]/20 group"
            onClick={() => handleRowClick(customer.id)}
          >
            <TableCell className="font-medium">
              {customer.first_name} {customer.last_name}
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone_number}</TableCell>
            <TableCell>
              <div 
                className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#FDE1D3]/50"
                    onClick={() => onEdit(customer)}
                  >
                    <Edit className="h-4 w-4 text-[#F97316]" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100"
                    onClick={() => onDelete(customer)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
              No customers found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
