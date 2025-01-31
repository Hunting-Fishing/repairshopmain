import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "../NhtsaVinDialog";
import { mapNhtsaData } from "./utils/nhtsaDataMapper";

interface VinDecoderFormProps {
  onVehicleInfo: (info: VehicleInfo) => void;
}

export const VinDecoderForm = ({ onVehicleInfo }: VinDecoderFormProps) => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('vehicle-info', {
        body: { type: 'decode', vin }
      });

      if (error) throw error;

      const mappedData = mapNhtsaData(data);
      mappedData.VIN = vin; // Ensure VIN is included in the response
      onVehicleInfo(mappedData);
    } catch (error) {
      console.error('Error decoding VIN:', error);
      toast({
        title: "Error",
        description: "Failed to decode VIN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          maxLength={17}
          minLength={17}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Decoding..." : "Decode VIN"}
      </Button>
    </form>
  );
};