import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VehicleInfoDisplay } from "./VehicleInfoDisplay";
import { VinDecoderForm } from "./vin-decoder/VinDecoderForm";

interface NhtsaVinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Organize vehicle information by categories
export interface VehicleInfo {
  // General Information
  Make: string;
  Model: string;
  ModelYear: string;
  "Manufacturer Name": string;
  "Plant City": string;
  "Plant Country": string;
  Trim: string;
  VehicleType: string;
  
  // Engine Specifications
  "Engine Number of Cylinders": string;
  "Displacement (L)": string;
  "Fuel Type - Primary": string;
  "Other Engine Info": string;
  Turbo: string;
  
  // Vehicle Details
  "Gross Vehicle Weight Rating From": string;
  "Body Class": string;
  "Drive Type": string;
  Series: string;
  
  [key: string]: string;
}

const initialVehicleInfo: VehicleInfo = {
  Make: '', Model: '', ModelYear: '', "Manufacturer Name": '', "Plant City": '',
  "Plant Country": '', Trim: '', VehicleType: '', "Engine Number of Cylinders": '',
  "Displacement (L)": '', "Fuel Type - Primary": '', "Other Engine Info": '',
  Turbo: '', "Gross Vehicle Weight Rating From": '', "Body Class": '',
  "Drive Type": '', Series: ''
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
          <VinDecoderForm onVehicleInfo={setVehicleInfo} />
          <VehicleInfoDisplay vehicleInfo={vehicleInfo} />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};