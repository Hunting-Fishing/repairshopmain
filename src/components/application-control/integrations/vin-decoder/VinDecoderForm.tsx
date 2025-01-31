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
        };

        // Map NHTSA API results to our vehicle data structure
        data.Results.forEach((result: any) => {
          const value = result.Value;
          // Only store non-null and non-"Not Applicable" values
          if (value && value !== "null" && value !== "Not Applicable") {
            switch (result.Variable) {
              case "Make":
                vehicleData.Make = value;
                break;
              case "Model":
                vehicleData.Model = value;
                break;
              case "Model Year":
                vehicleData.ModelYear = value;
                break;
              case "Manufacturer Name":
                vehicleData["Manufacturer Name"] = value;
                break;
              case "Plant City":
                vehicleData["Plant City"] = value;
                break;
              case "Plant Country":
                vehicleData["Plant Country"] = value;
                break;
              case "Trim":
                vehicleData.Trim = value;
                break;
              case "Vehicle Type":
                vehicleData.VehicleType = value;
                break;
              case "Engine Number of Cylinders":
                vehicleData["Engine Number of Cylinders"] = value;
                break;
              case "Displacement (CC)":
                // Convert CC to Liters
                const liters = (parseInt(value) / 1000).toFixed(1);
                vehicleData["Displacement (L)"] = liters;
                break;
              case "Displacement (L)":
                vehicleData["Displacement (L)"] = value;
                break;
              case "Fuel Type - Primary":
                vehicleData["Fuel Type - Primary"] = value;
                break;
              case "Engine Configuration":
              case "Engine Model":
              case "Engine Manufacturer":
                // Combine engine information
                const currentInfo = vehicleData["Other Engine Info"] ? 
                  vehicleData["Other Engine Info"] + ", " : "";
                vehicleData["Other Engine Info"] = currentInfo + 
                  `${result.Variable}: ${value}`;
                break;
              case "Turbo":
                vehicleData.Turbo = value;
                break;
              case "Gross Vehicle Weight Rating From":
                vehicleData["Gross Vehicle Weight Rating From"] = value;
                break;
              case "Body Class":
                vehicleData["Body Class"] = value;
                break;
              case "Drive Type":
                vehicleData["Drive Type"] = value;
                break;
              case "Series":
                vehicleData.Series = value;
                break;
              default:
                // Log unhandled fields for debugging
                console.log(`Unhandled field: ${result.Variable} = ${value}`);
            }
          }
        });

        // Add the VIN to the vehicle data
        vehicleData.VIN = vin;

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