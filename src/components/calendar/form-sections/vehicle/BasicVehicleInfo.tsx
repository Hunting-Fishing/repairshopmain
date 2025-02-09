
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";

interface BasicVehicleInfoProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BasicVehicleInfo({ form }: BasicVehicleInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="vehicleInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Information</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
