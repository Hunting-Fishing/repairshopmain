import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StaffDetailsFormValues } from "../types";

interface EmergencyContactFieldsProps {
  form: UseFormReturn<StaffDetailsFormValues>;
}

export function EmergencyContactFields({ form }: EmergencyContactFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Emergency Contact</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="emergency_contact.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emergency_contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="emergency_contact.relationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship</FormLabel>
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