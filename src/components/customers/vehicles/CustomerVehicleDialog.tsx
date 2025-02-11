
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleList } from "./VehicleList";
import { AddVehicleForm } from "./AddVehicleForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Vehicle } from "./types";

interface CustomerVehicleDialogProps {
  customerId: string | null;
  onClose: () => void;
  onSelect: (customerId: string, vehicleInfo: string) => void;
}

export function CustomerVehicleDialog({ customerId, onClose, onSelect }: CustomerVehicleDialogProps) {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    if (customerId) {
      // Create a detailed vehicle info string including all relevant information
      // Only include fields that exist and aren't empty
      const vehicleInfo = [
        vehicle?.year,
        vehicle?.make,
        vehicle?.model,
        vehicle?.trim,
        vehicle?.vin ? `VIN: ${vehicle.vin}` : '',
        vehicle?.engine_info?.displacement ? `${vehicle.engine_info.displacement}L` : '',
        vehicle?.engine_info?.cylinders ? `${vehicle.engine_info.cylinders}-cyl` : '',
        vehicle?.engine_info?.fuel_type || '',
        vehicle?.body_class || ''
      ].filter(Boolean).join(' ').trim();

      onSelect(customerId, vehicleInfo);
      onClose();
    }
  };

  return (
    <Dialog open={!!customerId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Vehicle for Work Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddVehicle(!showAddVehicle)}>
              <Plus className="mr-2 h-4 w-4" />
              {showAddVehicle ? "Cancel" : "Add New Vehicle"}
            </Button>
          </div>

          {showAddVehicle && customerId ? (
            <AddVehicleForm 
              customerId={customerId} 
              onSuccess={() => {
                setShowAddVehicle(false);
              }} 
            />
          ) : (
            customerId && (
              <VehicleList 
                customerId={customerId}
                onVehicleSelect={handleVehicleSelect}
                selectedVehicle={selectedVehicle}
              />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
