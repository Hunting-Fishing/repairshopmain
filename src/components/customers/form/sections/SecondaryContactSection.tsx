
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ValidationStatus } from "../../ValidationStatus";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";

interface SecondaryContactSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Family' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' }
];

export function SecondaryContactSection({ form, isModernTheme = false }: SecondaryContactSectionProps) {
  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  // Watch values for validation
  const phone = form.watch("secondary_contact.phone");
  const email = form.watch("secondary_contact.email");

  // Validate on value change
  const phoneValidation = phone ? validatePhoneNumber(phone) : null;
  const emailValidation = email ? validateEmail(email) : null;

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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="secondary_contact.phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Phone Number</FormLabel>
                {phoneValidation && (
                  <ValidationStatus 
                    status={phoneValidation.type || (phoneValidation.isValid ? 'success' : 'error')}
                    type="Phone"
                    message={phoneValidation.message || ''}
                    details={phoneValidation.details}
                  />
                )}
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
                {emailValidation && (
                  <ValidationStatus 
                    status={emailValidation.type || (emailValidation.isValid ? 'success' : 'error')}
                    type="Email"
                    message={emailValidation.message || ''}
                    details={emailValidation.details}
                  />
                )}
              </div>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email address" className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="secondary_contact.is_emergency"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
            <FormControl>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Emergency Contact
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
