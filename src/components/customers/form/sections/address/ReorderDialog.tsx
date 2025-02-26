
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GripVertical, Star } from "lucide-react";
import { CustomerFormValues } from "../../../types/customerTypes";

interface ReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: CustomerFormValues['address_book'];
}

export function ReorderDialog({ open, onOpenChange, addresses }: ReorderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reorder Addresses</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.street_address}
                  </p>
                </div>
              </div>
              {address.is_primary && (
                <Star className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
