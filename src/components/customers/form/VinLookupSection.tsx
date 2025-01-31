import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";

interface VinLookupSectionProps {
  onVehicleFound: (vehicleInfo: { make: string; model: string; year: string; vin: string }) => void;
}

export const VinLookupSection = ({ onVehicleFound }: VinLookupSectionProps) => {
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
        const vehicleInfo = {
          make: data.Results.find((r: any) => r.Variable === "Make")?.Value || "",
          model: data.Results.find((r: any) => r.Variable === "Model")?.Value || "",
          year: data.Results.find((r: any) => r.Variable === "Model Year")?.Value || "",
          vin: vin, // Include the VIN in the response
        };
        
        onVehicleFound(vehicleInfo);
        toast({
          title: "Success",
          description: "Vehicle information retrieved successfully",
        });
      }
    } catch (error: any) {
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-muted-foreground" />
        <Label>Vehicle Information</Label>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleDecodeVin} disabled={loading}>
          {loading ? "Looking up..." : "Lookup VIN"}
        </Button>
      </div>
    </div>
  );
};