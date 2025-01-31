import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

interface VehicleInfoSectionProps {
  form: any;
}

export const VehicleInfoSection = ({ form }: VehicleInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="vehicle_vin"
        render={({ field }) => (
          <FormItem>
            <Label>VIN</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_make"
        render={({ field }) => (
          <FormItem>
            <Label>Make</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_model"
        render={({ field }) => (
          <FormItem>
            <Label>Model</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_year"
        render={({ field }) => (
          <FormItem>
            <Label>Year</Label>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};