
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SMSDialog } from "./components/SMSDialog";
import { CommunicationItem } from "./components/CommunicationItem";
import { useCommunications } from "./hooks/useCommunications";

interface CustomerCommunicationsProps {
  customerId: string;
}

export function CustomerCommunications({ customerId }: CustomerCommunicationsProps) {
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const { data: communications, isLoading } = useCommunications(customerId);
  
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading communications...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Communications</h2>
        <div className="space-x-2">
          <SMSDialog
            customerId={customerId}
            customerPhoneNumber={customer?.phone_number}
            isOpen={isSMSDialogOpen}
            onOpenChange={setIsSMSDialogOpen}
          />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Communication
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {[...(communications?.messages ?? []), ...(communications?.sms ?? [])].sort((a, b) => {
          const dateA = new Date(a.sent_at);
          const dateB = new Date(b.sent_at);
          return dateB.getTime() - dateA.getTime();
        }).map((comm) => (
          <CommunicationItem key={comm.id} communication={comm} />
        ))}
      </div>
    </div>
  );
}
