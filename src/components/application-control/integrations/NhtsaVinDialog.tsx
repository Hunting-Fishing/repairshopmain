import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfoDisplay } from "./VehicleInfoDisplay";

interface NhtsaVinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface VehicleInfo {
  Make: string;
  Model: string;
  ModelYear: string;
  VehicleType: string;
  "Engine Number of Cylinders": string;
  "Displacement (L)": string;
  "Fuel Type - Primary": string;
  "Other Engine Info": string;
  Turbo: string;
  "Gross Vehicle Weight Rating From": string;
  "Manufacturer Name": string;
  "Plant City": string;
  "Plant Country": string;
  Trim: string;
  "Body Class": string;
  "Drive Type": string;
  Series: string;
  [key: string]: string;
}

const initialVehicleInfo: VehicleInfo = {
  Make: '',
  Model: '',
  ModelYear: '',
  VehicleType: '',
  "Engine Number of Cylinders": '',
  "Displacement (L)": '',
  "Fuel Type - Primary": '',
  "Other Engine Info": '',
  Turbo: '',
  "Gross Vehicle Weight Rating From": '',
  "Manufacturer Name": '',
  "Plant City": '',
  "Plant Country": '',
  Trim: '',
  "Body Class": '',
  "Drive Type": '',
  Series: ''
};

export const NhtsaVinDialog = ({ isOpen, onClose }: NhtsaVinDialogProps) => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>(initialVehicleInfo);
  const { toast } = useToast();

  const handleDecodeVin = async () => {
    if (!vin) {
      toast({
        title: "Error",
        description: "Please enter a VIN",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('decode-vin', {
        body: { vin }
      });

      if (error) throw error;

      if (data.Results) {
        const vehicleData: VehicleInfo = { ...initialVehicleInfo };
        data.Results.forEach((result: any) => {
          if (result.Value && result.Value !== "null" && result.Value !== "Not Applicable") {
            vehicleData[result.Variable] = result.Value;
          }
        });
        setVehicleInfo(vehicleData);
        
        toast({
          title: "Success",
          description: "VIN decoded successfully",
        });
      }
    } catch (error) {
      console.error('Error decoding VIN:', error);
      toast({
        title: "Error",
        description: "Failed to decode VIN",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div className="flex gap-2">
            <Input
              placeholder="Enter VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleDecodeVin} disabled={loading}>
              {loading ? "Decoding..." : "Decode VIN"}
            </Button>
          </div>

          <VehicleInfoDisplay vehicleInfo={vehicleInfo} />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};