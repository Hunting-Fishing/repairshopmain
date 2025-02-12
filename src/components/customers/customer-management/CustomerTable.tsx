
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailDialog } from "../communications/components/EmailDialog";
import { SMSDialog } from "../communications/components/SMSDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerTableHeader } from "./CustomerTableHeader";
import { CustomerTableRow } from "./CustomerTableRow";

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

  const { data: lastCommunications } = useQuery({
    queryKey: ["last-communications", customers.map(c => c.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unified_communications")
        .select("customer_id, type, status, sent_at")
        .in("customer_id", customers.map(c => c.id))
        .order("sent_at", { ascending: false });

      if (error) throw error;

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

  return (
    <>
      <Table>
        <TableHeader>
          <CustomerTableHeader />
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
                lastCommunication={lastCommunications?.[customer.id]}
                onEdit={onEdit}
                onDelete={onDelete}
                onEmailClick={(id) => setSelectedCustomer({ id, type: "email" })}
                onSMSClick={(id) => setSelectedCustomer({ id, type: "sms" })}
                onRowClick={handleRowClick}
              />
            ))
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
