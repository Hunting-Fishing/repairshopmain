
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
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { CustomerVehicleDialog } from "@/components/customers/vehicles/CustomerVehicleDialog";
import { useState } from "react";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect?: (customerId: string, vehicleInfo: string) => void;
}

export function WorkOrderForm({ form, onCustomerSelect }: WorkOrderFormProps) {
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    form.setValue('customerId', customerId);
    setShowVehicleDialog(true);
  };

  const handleVehicleSelect = (customerId: string, vehicleInfo: string) => {
    form.setValue('customerId', customerId);
    form.setValue('vehicleInfo', vehicleInfo);
    onCustomerSelect?.(customerId, vehicleInfo);
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

    // Extract other details using common patterns
    const vinMatch = info.match(/VIN:\s*([A-HJ-NPR-Z0-9]{17})/i);
    if (vinMatch) details.vin = vinMatch[1];

    const trimMatch = info.match(/Trim:\s*([^,]+)/i);
    if (trimMatch) details.trim = trimMatch[1].trim();

    const engineMatch = info.match(/Engine:\s*([^,]+)/i);
    if (engineMatch) details.engine = engineMatch[1].trim();

    const fuelMatch = info.match(/Fuel Type:\s*([^,]+)/i);
    if (fuelMatch) details.fuelType = fuelMatch[1].trim();

    const bodyMatch = info.match(/Body Style:\s*([^,]+)/i);
    if (bodyMatch) details.bodyStyle = bodyMatch[1].trim();

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
              <div>
                <input type="hidden" {...field} />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => selectedCustomerId && setShowVehicleDialog(true)}
                >
                  <Car className="mr-2 h-4 w-4" />
                  {vehicleInfo ? (
                    <span>{vehicleInfo}</span>
                  ) : (
                    <span className="text-muted-foreground">Select a vehicle...</span>
                  )}
                </Button>
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
                  {vehicleDetails.trim && (
                    <div>
                      <p className="text-sm text-muted-foreground">Trim</p>
                      <p className="font-medium">{vehicleDetails.trim}</p>
                    </div>
                  )}
                  {vehicleDetails.vin && (
                    <div>
                      <p className="text-sm text-muted-foreground">VIN</p>
                      <p className="font-medium">{vehicleDetails.vin}</p>
                    </div>
                  )}
                  {vehicleDetails.engine && (
                    <div>
                      <p className="text-sm text-muted-foreground">Engine</p>
                      <p className="font-medium">{vehicleDetails.engine}</p>
                    </div>
                  )}
                  {vehicleDetails.fuelType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-medium">{vehicleDetails.fuelType}</p>
                    </div>
                  )}
                  {vehicleDetails.bodyStyle && (
                    <div>
                      <p className="text-sm text-muted-foreground">Body Style</p>
                      <p className="font-medium">{vehicleDetails.bodyStyle}</p>
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
        onSelect={handleVehicleSelect}
      />
    </div>
  );
}
