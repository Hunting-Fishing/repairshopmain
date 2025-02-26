
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { CustomerTypeSelect } from "./fields/CustomerTypeSelect";
import { CustomerAddressFields } from "./CustomerAddressFields";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormSelect } from "./fields/FormSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SecondaryContactSection } from "./sections/SecondaryContactSection";
import { AddressBookSection } from "./sections/AddressBookSection";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  customerId: string;
  isModernTheme?: boolean;
}

export const CustomerFormFields = ({ form, customerId, isModernTheme = false }: CustomerFormFieldsProps) => {
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (customerId === "new") return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: customerId !== "new"
  });

  const { data: businessClassifications } = useQuery({
    queryKey: ["businessClassifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_classifications")
        .select("*");

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <CustomerTypeSelect 
          form={form} 
          isModernTheme={isModernTheme} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="first_name"
            label="First Name"
            placeholder="Enter first name"
            isModernTheme={isModernTheme}
            required={true}
          />
          <FormInput
            form={form}
            name="last_name"
            label="Last Name"
            placeholder="Enter last name"
            isModernTheme={isModernTheme}
            required={true}
          />
        </div>
        
        <FormInput
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email address"
          isModernTheme={isModernTheme}
          required={true}
        />
        
        <FormInput
          form={form}
          name="phone_number"
          label="Phone Number"
          placeholder="Enter phone number"
          isModernTheme={isModernTheme}
        />

        {form.watch("customer_type") === "Business" && (
          <div className="space-y-4">
            <FormInput
              form={form}
              name="company_size"
              label="Company Size"
              placeholder="Enter company size"
              isModernTheme={isModernTheme}
            />
            
            <FormSelect
              name="business_classification_id"
              label="Business Classification"
              placeholder="Select business classification"
              options={
                businessClassifications?.map(bc => ({
                  label: bc.name,
                  value: bc.id
                })) || []
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Address</h3>
        <CustomerAddressFields form={form} isModernTheme={isModernTheme} />
      </div>

      <AddressBookSection form={form} isModernTheme={isModernTheme} />
      
      <SecondaryContactSection form={form} isModernTheme={isModernTheme} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loyalty Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="loyalty_tier"
            label="Loyalty Tier"
            readOnly
            isModernTheme={isModernTheme}
          />
          <FormInput
            form={form}
            name="loyalty_points"
            label="Loyalty Points"
            type="number"
            readOnly
            isModernTheme={isModernTheme}
          />
        </div>
        {customer?.loyalty_join_date && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Member since {new Date(customer.loyalty_join_date).toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
