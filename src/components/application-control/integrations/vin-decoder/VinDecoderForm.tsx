import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "../NhtsaVinDialog";
import { mapNhtsaDataToVehicleInfo } from "./utils/nhtsaDataMapper";

interface VinDecoderFormProps {
  onVehicleInfo: (info: VehicleInfo) => void;
  onClose: () => void;
}

export const VinDecoderForm = ({ onVehicleInfo, onClose }: VinDecoderFormProps) => {
  const [vin, setVin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin) {
      toast({
        title: "Error",
        description: "Please enter a VIN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        'https://agtjuxiysmzhmpnbuzmc.supabase.co/functions/v1/vehicle-info',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'decode',
            vin: vin,
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const vehicleInfo = mapNhtsaDataToVehicleInfo(data, vin);
      onVehicleInfo(vehicleInfo);
      onClose();
    } catch (error: any) {
      toast({
        title: "Error decoding VIN",
        description: error.message || "Failed to decode VIN",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
        <Input
          id="vin"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="Enter VIN"
          maxLength={17}
          className="font-mono"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Decoding..." : "Decode VIN"}
        </Button>
      </div>
    </form>
  );
};