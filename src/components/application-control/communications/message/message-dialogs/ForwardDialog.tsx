
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { MessageSquare, Send, UserCircle2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForwardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId: string;
  onWorkOrderIdChange: (id: string) => void;
  onCustomerSelect: (id: string) => void;
  onSaveToWorkOrder: () => void;
  onSaveToCustomerFile: () => void;
  workOrders?: { id: string; description: string }[];
}

export function ForwardDialog({
  isOpen,
  onOpenChange,
  workOrderId,
  onWorkOrderIdChange,
  onCustomerSelect,
  onSaveToWorkOrder,
  onSaveToCustomerFile,
  workOrders,
}: ForwardDialogProps) {
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Forward File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <h4 className="font-medium">Send to Work Order</h4>
            <div className="flex gap-2">
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={workOrderId}
                onChange={(e) => onWorkOrderIdChange(e.target.value)}
              >
                <option value="">Select a work order...</option>
                {workOrders?.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    #{wo.id} - {wo.description}
                  </option>
                ))}
              </select>
              <Button onClick={onSaveToWorkOrder}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Forward to:</h4>
            <div className="space-y-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Select Customer</h4>
                <CustomerSearchCommand onSelect={onCustomerSelect} />
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={onSaveToCustomerFile}
                >
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Save to Customer File
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon",
                  });
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Other Chat
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon",
                  });
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Group
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
