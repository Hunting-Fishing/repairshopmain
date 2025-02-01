import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VehicleInfoDisplay } from "./VehicleInfoDisplay";
import { VinDecoderForm } from "./vin-decoder/VinDecoderForm";

interface NhtsaVinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleInfo?: (vehicleInfo: VehicleInfo) => void;
}

// Updated interface based on actual NHTSA data structure
export interface VehicleInfo {
  // General Information
  Make: string;
  Model: string;
  ModelYear: string;
  ProductionDate: string;
  Trim: string;
  VehicleType: string;
  VIN?: string;
  
  // Engine Specifications
  "Engine Number of Cylinders": string;
  "Displacement (L)": string;
  "Fuel Type - Primary": string;
  "Other Engine Info": string;
  Turbo: string;
  
  // Vehicle Details
  "Body Class": string;
  "Drive Type": string;
  "Gross Vehicle Weight Rating": string;
  "Plant Country": string;
}

const initialVehicleInfo: VehicleInfo = {
  Make: '',
  Model: '',
  ModelYear: '',
  ProductionDate: '',
  Trim: '',
  VehicleType: '',
  "Engine Number of Cylinders": '',
  "Displacement (L)": '',
  "Fuel Type - Primary": '',
  "Other Engine Info": '',
  Turbo: '',
  "Body Class": '',
  "Drive Type": '',
  "Gross Vehicle Weight Rating": '',
  "Plant Country": ''
};

export const NhtsaVinDialog = ({ isOpen, onClose, onVehicleInfo }: NhtsaVinDialogProps) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>(initialVehicleInfo);

  const handleVehicleInfoUpdate = (info: VehicleInfo) => {
    setVehicleInfo(info);
    onVehicleInfo?.(info);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>NHTSA VIN Decoder</DialogTitle>
          <DialogDescription>
            Enter a Vehicle Identification Number (VIN) to get detailed vehicle information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <VinDecoderForm onVehicleInfo={handleVehicleInfoUpdate} onClose={onClose} />
          <VehicleInfoDisplay vehicleInfo={vehicleInfo} />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};