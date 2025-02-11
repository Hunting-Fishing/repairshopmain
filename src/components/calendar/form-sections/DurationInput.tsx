
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";

interface DurationInputProps {
  form: UseFormReturn<BookingFormValues>;
}

export function DurationInput({ form }: DurationInputProps) {
  return (
    <FormField
      control={form.control}
      name="duration_minutes"
      defaultValue={60}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={15}
              step={15}
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
