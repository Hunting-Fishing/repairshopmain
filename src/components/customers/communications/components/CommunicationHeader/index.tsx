
import { ActionButtons } from "./ActionButtons";

interface CommunicationHeaderProps {
  customerId: string;
  customerPhoneNumber?: string;
  isSMSDialogOpen: boolean;
  setIsSMSDialogOpen: (open: boolean) => void;
}

export function CommunicationHeader({ 
  customerId, 
  customerPhoneNumber, 
  isSMSDialogOpen, 
  setIsSMSDialogOpen 
}: CommunicationHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Communications</h2>
      <ActionButtons
        customerId={customerId}
        customerPhoneNumber={customerPhoneNumber}
        isSMSDialogOpen={isSMSDialogOpen}
        setIsSMSDialogOpen={setIsSMSDialogOpen}
      />
    </div>
  );
}
