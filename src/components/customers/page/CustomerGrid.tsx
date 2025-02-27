
import { Users, Mail, MessageSquare } from "lucide-react";
import { Customer } from "../customer-management/CustomerTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useCallback, memo } from "react";
import { EmailDialog } from "../communications/components/EmailDialog";
import { SMSDialog } from "../communications/components/SMSDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface CustomerGridProps {
  customers: Customer[];
  isModernTheme?: boolean;
}

// Memoized customer card to prevent unnecessary re-renders
const CustomerCard = memo(function CustomerCard({
  customer,
  lastCommunication,
  onEmailClick,
  onSMSClick,
  onNavigate,
  isModernTheme
}: {
  customer: Customer;
  lastCommunication?: any;
  onEmailClick: (id: string) => void;
  onSMSClick: (id: string) => void;
  onNavigate: (id: string) => void;
  isModernTheme: boolean;
}) {
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
    <div 
      onClick={() => onNavigate(customer.id)}
      className={`${
        isModernTheme
          ? 'bg-white/90 border border-blue-100/50 hover:shadow-md'
          : 'bg-white border border-gray-200 hover:shadow-md'
      } rounded-lg shadow-sm p-4 transition-shadow cursor-pointer group`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${
            isModernTheme ? 'bg-blue-50' : 'bg-[#FDE1D3]'
          } rounded-full`}>
            <Users className={`h-4 w-4 ${
              isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
            }`} />
          </div>
          <h3 className="font-medium">{customer.first_name} {customer.last_name}</h3>
        </div>
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
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>{customer.email}</p>
        <p>{customer.phone_number}</p>
        {lastCommunication && (
          <Badge className={getStatusColor(lastCommunication.status)}>
            {lastCommunication.type} - {lastCommunication.status}
          </Badge>
        )}
      </div>
    </div>
  );
});

export function CustomerGrid({ customers, isModernTheme = false }: CustomerGridProps) {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    type: "email" | "sms" | null;
  }>({ id: "", type: null });
  
  const parentRef = useRef<HTMLDivElement>(null);

  // Optimize communications query with proper caching
  const { data: lastCommunications } = useQuery({
    queryKey: ["last-communications-grid", customers.map(c => c.id)],
    queryFn: async () => {
      if (customers.length === 0) return {};
      
      const { data, error } = await supabase
        .from("unified_communications")
        .select("customer_id, type, status, sent_at")
        .in("customer_id", customers.map(c => c.id))
        .order("sent_at", { ascending: false });

      if (error) throw error;

      // Use reduce for efficient grouping - reduces multiple iterations
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

  // Memoize handlers to prevent recreation on every render
  const handleEmailClick = useCallback((id: string) => {
    setSelectedCustomer({ id, type: "email" });
  }, []);

  const handleSMSClick = useCallback((id: string) => {
    setSelectedCustomer({ id, type: "sms" });
  }, []);

  const handleNavigate = useCallback((id: string) => {
    navigate(`/customers/${id}`);
  }, [navigate]);

  const handleCloseDialog = useCallback(() => {
    setSelectedCustomer({ id: "", type: null });
  }, []);

  // Virtualized grid for performance with large datasets
  const virtualizer = useVirtualizer({
    count: customers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160,  // Approximate height of a customer card
    overscan: 5,
  });

  // Get selected customer info for dialogs
  const selectedCustomerInfo = useMemo(() => {
    if (!selectedCustomer.id) return null;
    return customers.find(c => c.id === selectedCustomer.id);
  }, [selectedCustomer.id, customers]);

  // Empty state for no customers
  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers found
      </div>
    );
  }

  return (
    <>
      <div 
        ref={parentRef} 
        className="h-[calc(100vh-320px)] overflow-auto"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const customer = customers[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="p-2">
                  <CustomerCard
                    customer={customer}
                    lastCommunication={lastCommunications?.[customer.id]}
                    onEmailClick={handleEmailClick}
                    onSMSClick={handleSMSClick}
                    onNavigate={handleNavigate}
                    isModernTheme={isModernTheme}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCustomer.type === "email" && selectedCustomerInfo && (
        <EmailDialog
          customerId={selectedCustomer.id}
          customerEmail={selectedCustomerInfo.email}
          isOpen={true}
          onOpenChange={handleCloseDialog}
        />
      )}

      {selectedCustomer.type === "sms" && selectedCustomerInfo && (
        <SMSDialog
          customerId={selectedCustomer.id}
          customerPhoneNumber={selectedCustomerInfo.phone_number}
          isOpen={true}
          onOpenChange={handleCloseDialog}
        />
      )}
    </>
  );
}
