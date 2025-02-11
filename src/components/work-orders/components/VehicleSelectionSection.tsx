
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useState } from "react";
import { CustomerVehicleDialog } from "@/components/customers/vehicles/CustomerVehicleDialog";
import { UseFormReturn } from "react-hook-form";

interface VehicleSelectionSectionProps {
  form: UseFormReturn<any>;
  customerId: string | null;
}

export function VehicleSelectionSection({ form, customerId }: VehicleSelectionSectionProps) {
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);

  const handleVehicleSelect = (customerId: string, vehicleInfo: string) => {
    form.setValue('vehicleInfo', vehicleInfo);
  };

  return (
    <FormField
      control={form.control}
      name="vehicleInfo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vehicle Information</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowVehicleDialog(true)}
              >
                <Car className="mr-2 h-4 w-4" />
                {field.value || "Select Vehicle"}
              </Button>

              {customerId && (
                <CustomerVehicleDialog
                  customerId={customerId}
                  onClose={() => setShowVehicleDialog(false)}
                  onSelect={handleVehicleSelect}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
