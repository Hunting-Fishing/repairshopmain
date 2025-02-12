
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
import { Edit, Mail, MessageSquare, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailDialog } from "../communications/components/EmailDialog";
import { SMSDialog } from "../communications/components/SMSDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    type: "email" | "sms" | null;
  }>({ id: "", type: null });

  // Fetch last communication for each customer
  const { data: lastCommunications } = useQuery({
    queryKey: ["last-communications", customers.map(c => c.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unified_communications")
        .select("customer_id, type, status, sent_at")
        .in("customer_id", customers.map(c => c.id))
        .order("sent_at", { ascending: false });

      if (error) throw error;

      // Get the latest communication for each customer
      const latestByCustomer = data.reduce((acc, curr) => {
        if (!acc[curr.customer_id] || new Date(curr.sent_at) > new Date(acc[curr.customer_id].sent_at)) {
          acc[curr.customer_id] = curr;
        }
        return acc;
      }, {} as Record<string, any>);

      return latestByCustomer;
    },
    enabled: customers.length > 0
  });

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
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Email</TableHead>
            <TableHead className="font-semibold text-gray-700">Phone</TableHead>
            <TableHead className="font-semibold text-gray-700">Last Contact</TableHead>
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
                {lastCommunications?.[customer.id] && (
                  <Badge className={getStatusColor(lastCommunications[customer.id].status)}>
                    {lastCommunications[customer.id].type} - {lastCommunications[customer.id].status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div 
                  className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  {customer.email && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-[#FDE1D3]/50"
                      onClick={() => setSelectedCustomer({ id: customer.id, type: "email" })}
                    >
                      <Mail className="h-4 w-4 text-[#F97316]" />
                    </Button>
                  )}
                  {customer.phone_number && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-[#FDE1D3]/50"
                      onClick={() => setSelectedCustomer({ id: customer.id, type: "sms" })}
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
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedCustomer.type === "email" && (
        <EmailDialog
          customerId={selectedCustomer.id}
          customerEmail={customers.find(c => c.id === selectedCustomer.id)?.email}
          isOpen={true}
          onOpenChange={() => setSelectedCustomer({ id: "", type: null })}
        />
      )}

      {selectedCustomer.type === "sms" && (
        <SMSDialog
          customerId={selectedCustomer.id}
          customerPhoneNumber={customers.find(c => c.id === selectedCustomer.id)?.phone_number}
          isOpen={true}
          onOpenChange={() => setSelectedCustomer({ id: "", type: null })}
        />
      )}
    </>
  );
}
