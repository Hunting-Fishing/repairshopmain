
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormInput } from "../fields/FormInput";
import { cn } from "@/lib/utils";
import { Building2, User, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  isModernTheme = false,
}: CustomerTypeSectionProps) {
  const customerType = form.watch("customer_type");
  const { toast } = useToast();
  const isInitialMount = useRef(true);
  const previousType = useRef(customerType);

  // Reset business fields when changing away from business type
  useEffect(() => {
    if (!isInitialMount.current && previousType.current === "Business" && customerType !== "Business") {
      form.setValue("company_name", "");
      form.setValue("business_classification_id", "");
      form.setValue("company_size", "");
      form.clearErrors(["company_name", "business_classification_id", "company_size"]);
    }
    previousType.current = customerType;
  }, [customerType, form]);

  // Handle customer type changes and validate fields
  useEffect(() => {
    // Skip validation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only validate business fields if customer type is Business
    if (customerType === "Business") {
      const validateBusinessFields = () => {
        const companyName = form.getValues("company_name");
        const businessClassification = form.getValues("business_classification_id");
        const companySize = form.getValues("company_size");
        
        const missingFields = [];
        if (!companyName) missingFields.push("Company Name");
        if (!businessClassification) missingFields.push("Business Classification");
        if (!companySize) missingFields.push("Company Size");

        if (missingFields.length > 0) {
          toast({
            title: "Business Information Required",
            description: `Please provide: ${missingFields.join(", ")}`,
            duration: 5000,
            variant: "destructive"
          });
        }
      };

      // Set a small delay to ensure form values are updated
      const timeoutId = setTimeout(validateBusinessFields, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [customerType, form, toast]);

  return (
    <FormSection 
      title="Customer Type" 
      description="Select the type of customer account"
      isModernTheme={isModernTheme}
    >
      <div className="w-full max-w-md space-y-6">
        <FormField
          control={form.control}
          name="customer_type"
          rules={{
            required: "Customer type is required",
            validate: (value) => {
              if (value === "Business") {
                const companyName = form.getValues("company_name");
                const businessClassification = form.getValues("business_classification_id");
                const companySize = form.getValues("company_size");
                
                // Only validate business fields if we're submitting as a business
                if (!companyName || !businessClassification || !companySize) {
                  return "Please complete all required business information";
                }
              }
              return true;
            }
          }}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className={cn(
                isModernTheme
                  ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
                  : "text-gray-700 font-medium"
              )}>
                Customer Type <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const previousValue = field.value;
                    field.onChange(value);
                    
                    // Only show toast if there's an actual change
                    if (previousValue !== value) {
                      toast({
                        title: "Customer Type Changed",
                        description: `Customer type set to: ${value}`,
                        duration: 3000,
                        variant: "default"
                      });
                    }
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Personal" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Business" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Business
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Fleet" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Fleet
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {customerType === "Business" && (
          <div className="space-y-4 animate-fadeIn">
            <FormInput
              form={form}
              name="company_name"
              label="Company Name"
              required={true}
              placeholder="Enter company name"
              isModernTheme={isModernTheme}
            />
            
            <FormInput
              form={form}
              name="business_classification_id"
              label="Business Classification"
              required={true}
              placeholder="Select business classification"
              isModernTheme={isModernTheme}
            />

            <FormInput
              form={form}
              name="company_size"
              label="Company Size"
              required={true}
              placeholder="Enter company size"
              isModernTheme={isModernTheme}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
}
