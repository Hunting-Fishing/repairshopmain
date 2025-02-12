
import { Users, Mail, MessageSquare } from "lucide-react";
import { Customer } from "../customer-management/CustomerTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EmailDialog } from "../communications/components/EmailDialog";
import { SMSDialog } from "../communications/components/SMSDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CustomerGridProps {
  customers: Customer[];
  isModernTheme?: boolean;
}

export function CustomerGrid({ customers, isModernTheme = false }: CustomerGridProps) {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    type: "email" | "sms" | null;
  }>({ id: "", type: null });

  const { data: lastCommunications } = useQuery({
    queryKey: ["last-communications-grid", customers.map(c => c.id)],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {customers.map((customer) => (
          <div 
            key={customer.id}
            onClick={() => navigate(`/customers/${customer.id}`)}
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
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{customer.email}</p>
              <p>{customer.phone_number}</p>
              {lastCommunications?.[customer.id] && (
                <Badge className={getStatusColor(lastCommunications[customer.id].status)}>
                  {lastCommunications[customer.id].type} - {lastCommunications[customer.id].status}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

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
