import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVehicleForm = (customerId: string, onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showVinDialog, setShowVinDialog] = useState(false);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleYearChange = async (selectedYear: string) => {
    setYear(selectedYear);
    setMake("");
    setModel("");
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForModelYear/${selectedYear}?format=json`);
      const data = await response.json();
      setMakes(data.Results.map((result: any) => result.Make_Name));
    } catch (error) {
      console.error("Error fetching makes:", error);
      toast({ title: "Error", description: "Failed to fetch vehicle makes", variant: "destructive" });
    }
  };

  const handleMakeChange = async (selectedMake: string) => {
    setMake(selectedMake);
    setModel("");
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${selectedMake}/modelyear/${year}?format=json`);
      const data = await response.json();
      setModels(data.Results.map((result: any) => result.Model_Name));
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({ title: "Error", description: "Failed to fetch vehicle models", variant: "destructive" });
    }
  };

  const handleVehicleInfo = async (vehicleInfo: any) => {
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

      await supabase.from("vehicles").insert({
        customer_id: customerId,
        organization_id: userData.organization_id,
        vin: vehicleInfo.VIN || null,
        make: vehicleInfo.Make || make,
        model: vehicleInfo.Model || model,
        year: vehicleInfo.ModelYear || year,
        trim: vehicleInfo.Trim || null,
        body_class: vehicleInfo["Body Class"] || null,
        engine_info: cleanEngineInfo,
        created_by: profile.user?.id,
        updated_by: profile.user?.id,
      });

      toast({ title: "Success", description: "Vehicle added successfully" });
      queryClient.invalidateQueries({ queryKey: ["vehicles", customerId] });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({ title: "Error", description: "Failed to add vehicle: " + error.message, variant: "destructive" });
    } finally {
      setLoading(false);
      setShowVinDialog(false);
    }
  };

  return {
    loading,
    showVinDialog,
    setShowVinDialog,
    year,
    make,
    model,
    makes,
    models,
    handleYearChange,
    handleMakeChange,
    handleVehicleInfo,
  };
};