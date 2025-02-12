
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SMSDialog } from "../SMSDialog";
import { EmailDialog } from "../EmailDialog";

interface ActionButtonsProps {
  customerId: string;
  customerEmail?: string;
  customerPhoneNumber?: string;
  isSMSDialogOpen: boolean;
  setIsSMSDialogOpen: (open: boolean) => void;
  isEmailDialogOpen: boolean;
  setIsEmailDialogOpen: (open: boolean) => void;
}

export function ActionButtons({ 
  customerId, 
  customerEmail,
  customerPhoneNumber, 
  isSMSDialogOpen, 
  setIsSMSDialogOpen,
  isEmailDialogOpen,
  setIsEmailDialogOpen
}: ActionButtonsProps) {
  return (
    <div className="space-x-2">
      <EmailDialog
        customerId={customerId}
        customerEmail={customerEmail}
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />
      <SMSDialog
        customerId={customerId}
        customerPhoneNumber={customerPhoneNumber}
        isOpen={isSMSDialogOpen}
        onOpenChange={setIsSMSDialogOpen}
      />
    </div>
  );
}
