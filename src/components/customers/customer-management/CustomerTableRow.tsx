
import { Customer } from "./CustomerTable";
import { Button } from "@/components/ui/button";
import { Edit, Mail, MessageSquare, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomerTableRowProps {
  customer: Customer;
  lastCommunication?: any;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onEmailClick: (id: string) => void;
  onSMSClick: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function CustomerTableRow({
  customer,
  lastCommunication,
  onEdit,
  onDelete,
  onEmailClick,
  onSMSClick,
  onRowClick,
}: CustomerTableRowProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr
      className="cursor-pointer transition-all duration-200 hover:bg-[#FDE1D3]/20 group"
      onClick={() => onRowClick(customer.id)}
    >
      <td className="font-medium">
        {customer.first_name} {customer.last_name}
      </td>
      <td>{customer.email}</td>
      <td>{customer.phone_number}</td>
      <td>
        {lastCommunication && (
          <Badge className={getStatusColor(lastCommunication.status)}>
            {lastCommunication.type} - {lastCommunication.status}
          </Badge>
        )}
      </td>
      <td>
        <div 
          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" 
          onClick={(e) => e.stopPropagation()}
        >
          {customer.email && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#FDE1D3]/50"
              onClick={() => onEmailClick(customer.id)}
            >
              <Mail className="h-4 w-4 text-[#F97316]" />
            </Button>
          )}
          {customer.phone_number && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#FDE1D3]/50"
              onClick={() => onSMSClick(customer.id)}
            >
              <MessageSquare className="h-4 w-4 text-[#F97316]" />
            </Button>
          )}
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
      </td>
    </tr>
  );
}
