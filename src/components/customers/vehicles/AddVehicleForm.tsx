import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { VinDecoderForm } from "@/components/application-control/integrations/vin-decoder/VinDecoderForm";
import { useQueryClient } from "@tanstack/react-query";

interface AddVehicleFormProps {
  customerId: string;
  onSuccess?: () => void;
}

export const AddVehicleForm = ({ customerId, onSuccess }: AddVehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleVehicleInfo = async (vehicleInfo: any) => {
    setLoading(true);
    try {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const { error } = await supabase.from("vehicles").insert({
        customer_id: customerId,
        organization_id: userData.organization_id,
        vin: vehicleInfo.VIN || "",
        make: vehicleInfo.Make || "",
        model: vehicleInfo.Model || "",
        year: vehicleInfo.ModelYear || "",
        trim: vehicleInfo.Trim || "",
        body_class: vehicleInfo["Body Class"] || "",
        engine_info: {
          cylinders: vehicleInfo["Engine Number of Cylinders"] || "",
          displacement: vehicleInfo["Displacement (L)"] || "",
          fuel_type: vehicleInfo["Fuel Type - Primary"] || "",
        },
        created_by: profile.user?.id,
        updated_by: profile.user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["vehicles", customerId] });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <VinDecoderForm onVehicleInfo={handleVehicleInfo} />
    </div>
  );
};