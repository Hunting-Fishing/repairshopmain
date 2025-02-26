
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ValidationStatus } from "../../ValidationStatus";

interface SecondaryContactSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function SecondaryContactSection({ form, isModernTheme = false }: SecondaryContactSectionProps) {
  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Secondary Contact</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="secondary_contact.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter contact name" className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondary_contact.relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter relationship" className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondary_contact.phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Phone Number</FormLabel>
                <ValidationStatus 
                  status="pending"
                  type="Phone"
                  message="Phone number validation pending"
                />
              </div>
              <FormControl>
                <Input {...field} placeholder="Enter phone number" className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondary_contact.email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                <ValidationStatus 
                  status="pending"
                  type="Email"
                  message="Email validation pending"
                />
              </div>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email address" className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
