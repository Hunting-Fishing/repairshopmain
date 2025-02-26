
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";
import { Mail, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from "@/utils/validation/countryCodes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface BasicInformationSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function BasicInformationSection({
  form,
  isModernTheme = false,
}: BasicInformationSectionProps) {
  const { toast } = useToast();

  // Watch form values for validation
  const email = form.watch("email");
  const phoneNumber = form.watch("phone_number");

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "blur") {
        if (name === "email" && value.email) {
          const emailValidation = validateEmail(value.email);
          if (!emailValidation.isValid) {
            toast({
              title: "Invalid Email",
              description: emailValidation.message,
              variant: "destructive"
            });
          }
        }
        if (name === "phone_number" && value.phone_number) {
          const phoneValidation = validatePhoneNumber(value.phone_number);
          if (!phoneValidation.isValid) {
            toast({
              title: "Invalid Phone Number",
              description: phoneValidation.message,
              variant: "destructive"
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, toast]);

  return (
    <FormSection 
      title="Basic Information" 
      description="Enter the customer's basic contact information"
      isModernTheme={isModernTheme}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          required={true}
          placeholder="Enter first name"
          icon={<User className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
          helpText="Legal first name of the customer"
        />
        
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          required={true}
          placeholder="Enter last name"
          icon={<User className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
          helpText="Legal last name of the customer"
        />

        <FormInput
          form={form}
          name="email"
          label="Email"
          type="email"
          required={true}
          placeholder="Enter email address"
          icon={<Mail className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
          helpText="Primary contact email address"
        />

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="phone_number"
            rules={{
              required: "Phone number is required",
              validate: (value) => {
                const validation = validatePhoneNumber(value);
                return validation.isValid || validation.message;
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field: countryField }) => (
                      <Select
                        value={countryField.value}
                        onValueChange={countryField.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem 
                              key={country.code} 
                              value={country.code}
                            >
                              {country.name} ({country.dialCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormControl>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        {...field}
                        type="tel"
                        placeholder="Enter phone number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}
