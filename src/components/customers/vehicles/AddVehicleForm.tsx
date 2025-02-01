import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NhtsaVinDialog } from "@/components/application-control/integrations/NhtsaVinDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Car, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddVehicleFormProps {
  customerId: string;
  onSuccess?: () => void;
}

export const AddVehicleForm = ({ customerId, onSuccess }: AddVehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showVinDialog, setShowVinDialog] = useState(false);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

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
      toast({
        title: "Error",
        description: "Failed to fetch vehicle makes",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to fetch vehicle models",
        variant: "destructive",
      });
    }
  };

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

  const handleYearMakeModelSubmit = async () => {
    if (!year || !make || !model) {
      toast({
        title: "Error",
        description: "Please select year, make, and model",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use VPIC API to get additional vehicle information
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeYear/make/${make}/modelyear/${year}?format=json`
      );
      const data = await response.json();
      
      // Create a simplified vehicle info object
      const vehicleInfo = {
        ModelYear: year,
        Make: make,
        Model: model,
        VehicleType: data.Results[0]?.VehicleTypeName || null,
      };

      await handleVehicleInfo(vehicleInfo);
    } catch (error) {
      console.error("Error fetching vehicle type:", error);
      // Still proceed with basic information
      await handleVehicleInfo({
        ModelYear: year,
        Make: make,
        Model: model,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Add New Vehicle</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowVinDialog(true)} 
            disabled={loading}
            variant="outline"
          >
            Lookup VIN
          </Button>
        </div>
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Year</Label>
            <Select onValueChange={handleYearChange} value={year}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Make</Label>
            <Select onValueChange={handleMakeChange} value={make} disabled={!year}>
              <SelectTrigger>
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select onValueChange={setModel} value={model} disabled={!make}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleYearMakeModelSubmit}
          disabled={loading || !year || !make || !model}
          className="w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Add Vehicle
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