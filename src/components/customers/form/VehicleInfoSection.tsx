import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NhtsaVinDialog } from "@/components/application-control/integrations/NhtsaVinDialog";
import { Car } from "lucide-react";

interface VehicleInfoSectionProps {
  form: any;
}

export const VehicleInfoSection = ({ form }: VehicleInfoSectionProps) => {
  const [showVinDialog, setShowVinDialog] = useState(false);

  const handleVehicleInfo = (vehicleInfo: any) => {
    form.setValue("vehicle_vin", vehicleInfo.VIN);
    form.setValue("vehicle_make", vehicleInfo.Make);
    form.setValue("vehicle_model", vehicleInfo.Model);
    form.setValue("vehicle_year", vehicleInfo.ModelYear);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <Label>Vehicle Information</Label>
        </div>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setShowVinDialog(true)}
        >
          Lookup VIN
        </Button>
      </div>

      <FormField
        control={form.control}
        name="vehicle_vin"
        render={({ field }) => (
          <FormItem>
            <Label>VIN</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_make"
        render={({ field }) => (
          <FormItem>
            <Label>Make</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_model"
        render={({ field }) => (
          <FormItem>
            <Label>Model</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_year"
        render={({ field }) => (
          <FormItem>
            <Label>Year</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <NhtsaVinDialog 
        isOpen={showVinDialog} 
        onClose={() => setShowVinDialog(false)} 
      />
    </div>
  );
};