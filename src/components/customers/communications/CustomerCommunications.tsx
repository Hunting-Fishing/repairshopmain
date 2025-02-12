
import { useState } from "react";
import { CommunicationHeader } from "./components/CommunicationHeader";
import { CommunicationList } from "./components/CommunicationList";
import { useCommunications } from "./hooks/useCommunications";
import { useCustomer } from "./hooks/useCustomer";

interface CustomerCommunicationsProps {
  customerId: string;
}

export function CustomerCommunications({ customerId }: CustomerCommunicationsProps) {
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const { data: communications, isLoading } = useCommunications(customerId);
  const { data: customer } = useCustomer(customerId);

  if (isLoading) return <div>Loading communications...</div>;

  return (
    <div className="space-y-4">
      <CommunicationHeader
        customerId={customerId}
        customerPhoneNumber={customer?.phone_number}
        isSMSDialogOpen={isSMSDialogOpen}
        setIsSMSDialogOpen={setIsSMSDialogOpen}
      />
      <CommunicationList communications={communications!} />
    </div>
  );
}
