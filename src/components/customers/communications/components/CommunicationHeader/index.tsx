
import { ActionButtons } from "./ActionButtons";

interface CommunicationHeaderProps {
  customerId: string;
  customerEmail?: string;
  customerPhoneNumber?: string;
  isSMSDialogOpen: boolean;
  setIsSMSDialogOpen: (open: boolean) => void;
  isEmailDialogOpen: boolean;
  setIsEmailDialogOpen: (open: boolean) => void;
}

export function CommunicationHeader({ 
  customerId, 
  customerEmail,
  customerPhoneNumber, 
  isSMSDialogOpen, 
  setIsSMSDialogOpen,
  isEmailDialogOpen,
  setIsEmailDialogOpen
}: CommunicationHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Communications</h2>
      <ActionButtons
        customerId={customerId}
        customerEmail={customerEmail}
        customerPhoneNumber={customerPhoneNumber}
        isSMSDialogOpen={isSMSDialogOpen}
        setIsSMSDialogOpen={setIsSMSDialogOpen}
        isEmailDialogOpen={isEmailDialogOpen}
        setIsEmailDialogOpen={setIsEmailDialogOpen}
      />
    </div>
  );
}
