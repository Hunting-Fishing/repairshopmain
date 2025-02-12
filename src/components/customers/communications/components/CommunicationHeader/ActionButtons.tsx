
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SMSDialog } from "../SMSDialog";

interface ActionButtonsProps {
  customerId: string;
  customerPhoneNumber?: string;
  isSMSDialogOpen: boolean;
  setIsSMSDialogOpen: (open: boolean) => void;
}

export function ActionButtons({ 
  customerId, 
  customerPhoneNumber, 
  isSMSDialogOpen, 
  setIsSMSDialogOpen 
}: ActionButtonsProps) {
  return (
    <div className="space-x-2">
      <SMSDialog
        customerId={customerId}
        customerPhoneNumber={customerPhoneNumber}
        isOpen={isSMSDialogOpen}
        onOpenChange={setIsSMSDialogOpen}
      />
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        New Communication
      </Button>
    </div>
  );
}
