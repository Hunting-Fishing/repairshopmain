
import { useToast } from "@/hooks/use-toast";

export function useInventoryValidation() {
  const { toast } = useToast();

  const validateInventoryForm = (values: any) => {
    if (!values.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return false;
    }

    if (values.quantity_in_stock < 0) {
      toast({
        title: "Validation Error",
        description: "Quantity cannot be negative",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateInventoryForm };
}
