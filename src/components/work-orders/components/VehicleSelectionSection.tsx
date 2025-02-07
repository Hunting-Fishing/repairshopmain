
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { VehicleFormSelects } from "@/components/customers/vehicles/components/VehicleFormSelects";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface VehicleSelectionSectionProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onVehicleSelect?: (vehicleInfo: string) => void;
}

export function VehicleSelectionSection({ form, onVehicleSelect }: VehicleSelectionSectionProps) {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  // Query for Makes based on selected Year
  const handleYearChange = async (selectedYear: string) => {
    setYear(selectedYear);
    setMake("");
    setModel("");
    try {
      const { data, error } = await supabase
        .from('vehicle_models_reference')
        .select('make')
        .eq('year', parseInt(selectedYear))
        .order('make');
      
      if (error) throw error;
      
      const uniqueMakes = [...new Set(data.map(item => item.make))];
      setMakes(uniqueMakes);
    } catch (error) {
      console.error("Error fetching makes:", error);
    }
  };

  // Query for Models based on selected Make and Year
  const handleMakeChange = async (selectedMake: string) => {
    setMake(selectedMake);
    setModel("");
    try {
      const { data, error } = await supabase
        .from('vehicle_models_reference')
        .select('model')
        .eq('year', parseInt(year))
        .eq('make', selectedMake)
        .order('model');
      
      if (error) throw error;
      
      const uniqueModels = [...new Set(data.map(item => item.model))];
      setModels(uniqueModels);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Handle Model selection and update form
  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
    if (year && make && selectedModel) {
      const vehicleInfo = `${year} ${make} ${selectedModel}`;
      form.setValue('vehicleInfo', vehicleInfo);
      onVehicleSelect?.(vehicleInfo);
    }
  };

  // Parse vehicle info string into an object
  const vehicleInfo = form.watch('vehicleInfo');
  const parseVehicleInfo = (info: string) => {
    const details: { [key: string]: string } = {};
    if (!info) return details;

    const basicInfo = info.split(' ');
    if (basicInfo[0]?.match(/^\d{4}$/)) {
      details.year = basicInfo[0];
      details.make = basicInfo[1] || '';
      details.model = basicInfo[2] || '';
    }

    return details;
  };

  const vehicleDetails = parseVehicleInfo(vehicleInfo);

  return (
    <FormField
      control={form.control}
      name="vehicleInfo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vehicle Information</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <input type="hidden" {...field} />
              <VehicleFormSelects
                year={year}
                make={make}
                model={model}
                makes={makes}
                models={models}
                onYearChange={handleYearChange}
                onMakeChange={handleMakeChange}
                onModelChange={handleModelChange}
              />
            </div>
          </FormControl>
          {vehicleInfo && (
            <Card className="p-4 mt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vehicleDetails.year && (
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{vehicleDetails.year}</p>
                  </div>
                )}
                {vehicleDetails.make && (
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="font-medium">{vehicleDetails.make}</p>
                  </div>
                )}
                {vehicleDetails.model && (
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{vehicleDetails.model}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
