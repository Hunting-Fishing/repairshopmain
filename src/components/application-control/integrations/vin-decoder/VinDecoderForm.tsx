import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleInfo } from "../NhtsaVinDialog";

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
        const vehicleData: VehicleInfo = {
          Make: '',
          Model: '',
          ModelYear: '',
          "Manufacturer Name": '',
          "Plant City": '',
          "Plant Country": '',
          Trim: '',
          VehicleType: '',
          "Engine Number of Cylinders": '',
          "Displacement (L)": '',
          "Fuel Type - Primary": '',
          "Other Engine Info": '',
          Turbo: '',
          "Gross Vehicle Weight Rating From": '',
          "Body Class": '',
          "Drive Type": '',
          Series: '',
          VIN: vin
        };

        // Map NHTSA API results to our vehicle data structure
        data.Results.forEach((result: any) => {
          const value = result.Value;
          // Only store non-null and non-"Not Applicable" values
          if (value && value !== "null" && value !== "Not Applicable") {
            switch (result.Variable) {
              case "Make":
              case "Model":
              case "Model Year":
              case "Manufacturer Name":
              case "Plant Country":
              case "Trim":
              case "Vehicle Type":
              case "Engine Number of Cylinders":
              case "Displacement (L)":
              case "Fuel Type - Primary":
              case "Other Engine Info":
              case "Turbo":
              case "Gross Vehicle Weight Rating From":
              case "Body Class":
              case "Drive Type":
                vehicleData[result.Variable] = value;
                break;
              // Handle any special cases or field name mappings
              case "Series":
                vehicleData["Series"] = value;
                break;
              default:
                // Log unhandled fields for debugging
                console.log(`Unhandled field: ${result.Variable} = ${value}`);
            }
          }
        });

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