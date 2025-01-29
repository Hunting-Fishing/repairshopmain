import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NhtsaVinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VehicleInfo {
  Make: string;
  Model: string;
  ModelYear: string;
  VehicleType: string;
  [key: string]: string;
}

const initialVehicleInfo: VehicleInfo = {
  Make: '',
  Model: '',
  ModelYear: '',
  VehicleType: ''
};

export const NhtsaVinDialog = ({ isOpen, onClose }: NhtsaVinDialogProps) => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
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

          {vehicleInfo && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Vehicle Information:</h3>
              <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-4 rounded-lg">
                {Object.entries(vehicleInfo).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{key}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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