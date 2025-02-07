
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Car } from "lucide-react";
import { CustomerVehicleDialog } from "@/components/customers/vehicles/CustomerVehicleDialog";
import { useState } from "react";
import { VehicleFormSelects } from "@/components/customers/vehicles/components/VehicleFormSelects";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect?: (customerId: string, vehicleInfo: string) => void;
}

export function WorkOrderForm({ form, onCustomerSelect }: WorkOrderFormProps) {
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  // Query for job templates
  const { data: jobTemplates } = useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = jobTemplates?.find(t => t.id === templateId);
    if (template) {
      form.setValue('jobTemplate', templateId);
      form.setValue('jobDescription', template.description || '');
    }
  };

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
      if (selectedCustomerId) {
        onCustomerSelect?.(selectedCustomerId, vehicleInfo);
      }
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    form.setValue('customerId', customerId);
  };

  // Parse vehicle info string into an object
  const vehicleInfo = form.watch('vehicleInfo');
  const parseVehicleInfo = (info: string) => {
    const details: { [key: string]: string } = {};
    if (!info) return details;

    // Extract year, make, model
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
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="customerId"
        render={() => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <FormControl>
              <CustomerSearchCommand 
                onSelect={handleCustomerSelect}
                className="border-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <FormField
        control={form.control}
        name="jobTemplate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Template</FormLabel>
            <Select onValueChange={handleTemplateSelect} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {jobTemplates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Enter the job description..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CustomerVehicleDialog
        customerId={selectedCustomerId}
        onClose={() => setShowVehicleDialog(false)}
        onSelect={(customerId, vehicleInfo) => {
          form.setValue('customerId', customerId);
          form.setValue('vehicleInfo', vehicleInfo);
          onCustomerSelect?.(customerId, vehicleInfo);
        }}
      />
    </div>
  );
}
