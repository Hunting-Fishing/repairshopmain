import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "../NhtsaVinDialog";
import { mapNhtsaDataToVehicleInfo } from "./utils/nhtsaDataMapper";

interface VinDecoderFormProps {
  onVehicleInfo: (info: VehicleInfo) => void;
}

export const VinDecoderForm = ({ onVehicleInfo }: VinDecoderFormProps) => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
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
        const vehicleData = mapNhtsaDataToVehicleInfo(data.Results, vin);
        console.log('Decoded vehicle data:', vehicleData);
        onVehicleInfo(vehicleData);
        
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
  );
};