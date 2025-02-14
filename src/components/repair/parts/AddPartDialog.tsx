
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PartFormFields } from "./PartFormFields";
import { useInventoryItems } from "./hooks/useInventoryItems";
import { usePartsMutation } from "./hooks/usePartsMutation";

interface AddPartDialogProps {
  repairJobId: string;
}

export function AddPartDialog({ repairJobId }: AddPartDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const { data: inventoryItems } = useInventoryItems();
  const addPartMutation = usePartsMutation(repairJobId);

  const handleAddPart = () => {
    if (!selectedPart || !quantity) {
      toast.error("Please select a part and specify quantity");
      return;
    }

    addPartMutation.mutate({
      inventory_item_id: selectedPart,
      quantity: parseInt(quantity),
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedPart("");
        setQuantity("");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Part</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Part to Repair Job</DialogTitle>
        </DialogHeader>
        <PartFormFields
          selectedPart={selectedPart}
          quantity={quantity}
          onPartChange={setSelectedPart}
          onQuantityChange={setQuantity}
          inventoryItems={inventoryItems}
        />
        <Button onClick={handleAddPart} disabled={addPartMutation.isPending}>
          Add Part
        </Button>
      </DialogContent>
    </Dialog>
  );
}
