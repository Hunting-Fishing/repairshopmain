import { Button } from "@/components/ui/button";
import { NhtsaVinDialog } from "@/components/application-control/integrations/NhtsaVinDialog";
import { Car, Search } from "lucide-react";
import { useVehicleForm } from "./hooks/useVehicleForm";
import { VehicleFormSelects } from "./components/VehicleFormSelects";

interface AddVehicleFormProps {
  customerId: string;
  onSuccess?: () => void;
}

export const AddVehicleForm = ({ customerId, onSuccess }: AddVehicleFormProps) => {
  const {
    loading,
    showVinDialog,
    setShowVinDialog,
    year,
    make,
    model,
    makes,
    models,
    handleYearChange,
    handleMakeChange,
    handleVehicleInfo,
  } = useVehicleForm(customerId, onSuccess);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Add New Vehicle</span>
        </div>
        <Button onClick={() => setShowVinDialog(true)} disabled={loading} variant="outline">
          Lookup VIN
        </Button>
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <VehicleFormSelects
          year={year}
          make={make}
          model={model}
          makes={makes}
          models={models}
          onYearChange={handleYearChange}
          onMakeChange={handleMakeChange}
          onModelChange={(value) => handleVehicleInfo({ ModelYear: year, Make: make, Model: value })}
        />
      </div>

      <NhtsaVinDialog
        isOpen={showVinDialog}
        onClose={() => setShowVinDialog(false)}
        onVehicleInfo={handleVehicleInfo}
      />
    </div>
  );
};