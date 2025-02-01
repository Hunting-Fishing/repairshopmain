import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NhtsaVinDialog } from "@/components/application-control/integrations/NhtsaVinDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Car } from "lucide-react";

interface AddVehicleFormProps {
  customerId: string;
  onSuccess?: () => void;
}

export const AddVehicleForm = ({ customerId, onSuccess }: AddVehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showVinDialog, setShowVinDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleVehicleInfo = async (vehicleInfo: any) => {
    console.log("Raw NHTSA Vehicle Info:", vehicleInfo);
    setLoading(true);
    try {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const engineInfo = {
        cylinders: vehicleInfo["Engine Number of Cylinders"] || null,
        displacement: vehicleInfo["Displacement (L)"] || null,
        fuel_type: vehicleInfo["Fuel Type - Primary"] || null,
        other_info: vehicleInfo["Other Engine Info"] || null,
        turbo: vehicleInfo["Turbo"] || null,
        drive_type: vehicleInfo["Drive Type"] || null,
        gvwr: vehicleInfo["Gross Vehicle Weight Rating"] || null,
        manufacturer: vehicleInfo["Manufacturer Name"] || null,
        plant_country: vehicleInfo["Plant Country"] || null,
        vehicle_type: vehicleInfo["Vehicle Type"] || null
      };

      const cleanEngineInfo = Object.fromEntries(
        Object.entries(engineInfo).filter(([_, value]) => value != null)
      );

      const { error } = await supabase.from("vehicles").insert({
        customer_id: customerId,
        organization_id: userData.organization_id,
        vin: vehicleInfo.VIN,
        make: vehicleInfo.Make,
        model: vehicleInfo.Model,
        year: vehicleInfo.ModelYear, // Using ModelYear directly from the API response
        trim: vehicleInfo.Trim,
        body_class: vehicleInfo["Body Class"],
        engine_info: cleanEngineInfo,
        created_by: profile.user?.id,
        updated_by: profile.user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["vehicles", customerId] });
      setShowVinDialog(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to add vehicle: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Add New Vehicle</span>
        </div>
        <Button 
          onClick={() => setShowVinDialog(true)} 
          disabled={loading}
        >
          Lookup VIN
        </Button>
      </div>

      <NhtsaVinDialog
        isOpen={showVinDialog}
        onClose={() => setShowVinDialog(false)}
        onVehicleInfo={handleVehicleInfo}
      />
    </div>
  );
};