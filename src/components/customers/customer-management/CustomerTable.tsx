
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
import { useState, useCallback, memo } from "react";
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

// Memoized table body component to prevent re-renders
const MemoizedTableBody = memo(function MemoizedTableBody({
  customers,
  lastCommunications,
  onEdit,
  onDelete,
  onEmailClick,
  onSMSClick,
  onRowClick
}: {
  customers: Customer[];
  lastCommunications: Record<string, any>;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onEmailClick: (id: string) => void;
  onSMSClick: (id: string) => void;
  onRowClick: (id: string) => void;
}) {
  return (
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
            onEmailClick={onEmailClick}
            onSMSClick={onSMSClick}
            onRowClick={onRowClick}
          />
        ))
      )}
    </TableBody>
  );
});

export function CustomerTable({ customers, onEdit, onDelete, isLoading }: CustomerTableProps) {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    type: "email" | "sms" | null;
  }>({ id: "", type: null });

  // Optimize communications query with proper cache configuration
  const { data: lastCommunications = {} } = useQuery({
    queryKey: ["last-communications", customers.map(c => c.id)],
    queryFn: async () => {
      if (customers.length === 0) return {};
      
      const { data, error } = await supabase
        .from("unified_communications")
        .select("customer_id, type, status, sent_at")
        .in("customer_id", customers.map(c => c.id))
        .order("sent_at", { ascending: false });

      if (error) throw error;

      // Use reduce for efficient grouping in a single pass
      const latestByCustomer = data.reduce((acc, curr) => {
        if (!acc[curr.customer_id] || new Date(curr.sent_at) > new Date(acc[curr.customer_id].sent_at)) {
          acc[curr.customer_id] = curr;
        }
        return acc;
      }, {} as Record<string, any>);

      return latestByCustomer;
    },
    enabled: customers.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, since communications don't change frequently
  });

  // Memoized event handlers to prevent recreation
  const handleRowClick = useCallback((customerId: string) => {
    navigate(`/customers/${customerId}`);
  }, [navigate]);

  const handleEmailClick = useCallback((id: string) => {
    setSelectedCustomer({ id, type: "email" });
  }, []);

  const handleSMSClick = useCallback((id: string) => {
    setSelectedCustomer({ id, type: "sms" });
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedCustomer({ id: "", type: null });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // Find selected customer for dialog
  const selectedCustomerData = selectedCustomer.id 
    ? customers.find(c => c.id === selectedCustomer.id) 
    : undefined;

  return (
    <>
      <Table>
        <TableHeader>
          <CustomerTableHeader />
        </TableHeader>
        <MemoizedTableBody
          customers={customers}
          lastCommunications={lastCommunications}
          onEdit={onEdit}
          onDelete={onDelete}
          onEmailClick={handleEmailClick}
          onSMSClick={handleSMSClick}
          onRowClick={handleRowClick}
        />
      </Table>

      {selectedCustomer.type === "email" && selectedCustomerData && (
        <EmailDialog
          customerId={selectedCustomer.id}
          customerEmail={selectedCustomerData.email}
          isOpen={true}
          onOpenChange={handleDialogClose}
        />
      )}

      {selectedCustomer.type === "sms" && selectedCustomerData && (
        <SMSDialog
          customerId={selectedCustomer.id}
          customerPhoneNumber={selectedCustomerData.phone_number}
          isOpen={true}
          onOpenChange={handleDialogClose}
        />
      )}
    </>
  );
}
