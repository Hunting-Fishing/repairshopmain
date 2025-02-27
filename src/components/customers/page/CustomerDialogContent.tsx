
import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { CustomerForm } from "../CustomerForm";

interface CustomerDialogContentProps {
  isOpen: boolean;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
  isModernTheme: boolean;
}

// Memoized dialog content to prevent re-renders
export const CustomerDialogContent = memo(function CustomerDialogContent({
  isOpen,
  onSuccess,
  onOpenChange,
  isModernTheme,
}: CustomerDialogContentProps) {
  if (!isOpen) return null;
  
  return (
    <DialogContent className={`sm:max-w-[800px] max-h-[90vh] ${
      isModernTheme
        ? 'bg-gradient-to-b from-white to-blue-50/10 border-blue-100/20'
        : 'bg-white'
    }`}>
      <ScrollArea className="max-h-[85vh]">
        <DialogHeader className="p-8 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        <div className="p-8">
          <CustomerForm 
            onSuccess={onSuccess} 
            mode="create"
            customerId="new"
          />
        </div>
      </ScrollArea>
    </DialogContent>
  );
});
