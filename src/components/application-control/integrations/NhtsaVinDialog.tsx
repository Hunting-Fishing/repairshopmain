import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VehicleInfoDisplay } from "./VehicleInfoDisplay";
import { VinDecoderForm } from "./vin-decoder/VinDecoderForm";

interface NhtsaVinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified vehicle information interface based on actual NHTSA data
export interface VehicleInfo {
  // General Information
  Make: string;
  Model: string;
  ModelYear: string;
  Trim: string;
  VehicleType: string;
  Series: string;
  Series2: string;
  VIN?: string;
  
  // Engine Specifications
  "Engine Number of Cylinders": string;
  "Displacement (L)": string;
  "Fuel Type - Primary": string;
  "Engine Configuration": string;
  Turbo: string;
  
  // Vehicle Details
  "Body Class": string;
  "Drive Type": string;
  "Gross Vehicle Weight Rating": string;
  
  [key: string]: string | undefined;
}

const initialVehicleInfo: VehicleInfo = {
  Make: '', 
  Model: '', 
  ModelYear: '', 
  Trim: '', 
  VehicleType: '', 
  Series: '',
  Series2: '', 
  "Engine Number of Cylinders": '', 
  "Displacement (L)": '',
  "Fuel Type - Primary": '', 
  "Engine Configuration": '', 
  Turbo: '',
  "Body Class": '', 
  "Drive Type": '',
  "Gross Vehicle Weight Rating": ''
};

export const NhtsaVinDialog = ({ isOpen, onClose }: NhtsaVinDialogProps) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>(initialVehicleInfo);

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
          <VinDecoderForm onVehicleInfo={setVehicleInfo} onClose={onClose} />
          <VehicleInfoDisplay vehicleInfo={vehicleInfo} />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};