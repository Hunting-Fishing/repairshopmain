
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormInput } from "../fields/FormInput";
import { FormSelect } from "../fields/FormSelect";
import { cn } from "@/lib/utils";
import { Building2, User, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  isModernTheme = false,
}: CustomerTypeSectionProps) {
  const customerType = form.watch("customer_type");
  const businessClassification = form.watch("business_classification_id");
  const { toast } = useToast();
  const isInitialMount = useRef(true);
  const previousType = useRef(customerType);
  const [showOtherField, setShowOtherField] = useState(false);

  // Reset business fields when changing away from business type
  useEffect(() => {
    if (!isInitialMount.current && previousType.current === "Business" && customerType !== "Business") {
      form.setValue("company_name", "");
      form.setValue("business_classification_id", "");
      form.setValue("business_classification_other", "");
      form.setValue("tax_number", "");
      form.clearErrors(["company_name", "business_classification_id", "tax_number"]);
      setShowOtherField(false);
    }
    
    previousType.current = customerType;
  }, [customerType, form]);

  // Handle business classification changes
  useEffect(() => {
    setShowOtherField(businessClassification === "other");
    if (businessClassification !== "other") {
      form.setValue("business_classification_other", "");
    }
  }, [businessClassification, form]);

  // Save other classification to database
  const saveOtherClassification = async (otherValue: string) => {
    if (businessClassification === "other" && otherValue) {
      try {
        const customerId = form.getValues("id");
        // Get organization_id from profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user");

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (!profile?.organization_id) throw new Error("No organization found");

        const { error } = await supabase
          .from('business_classification_others')
          .insert({
            customer_id: customerId,
            classification_type: "business",
            other_description: otherValue,
            organization_id: profile.organization_id
          });

        if (error) throw error;
      } catch (error) {
        console.error("Error saving other classification:", error);
        toast({
          title: "Error saving classification",
          description: "There was an error saving the other classification",
          variant: "destructive"
        });
      }
    }
  };

  // Handle customer type changes and validate fields
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (customerType === "Business") {
      const validateBusinessFields = () => {
        if (form.getValues("customer_type") === "Business") {
          const companyName = form.getValues("company_name");
          const businessClassification = form.getValues("business_classification_id");
          const otherClassificationValue = form.getValues("business_classification_other");
          const taxNumber = form.getValues("tax_number");
          
          const missingFields = [];
          if (!companyName) missingFields.push("Company Name");
          if (!businessClassification) missingFields.push("Business Classification");
          if (!taxNumber) missingFields.push("Tax #");
          if (businessClassification === "other" && !otherClassificationValue) {
            missingFields.push("Other Classification Description");
          }

          if (missingFields.length > 0) {
            toast({
              title: "Business Information Required",
              description: `Please provide: ${missingFields.join(", ")}`,
              duration: 5000,
              variant: "destructive"
            });
          }
        }
      };

      const timeoutId = setTimeout(validateBusinessFields, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [customerType, form, toast]);

  // Business classification options
  const businessClassificationOptions = [
    { value: "retail", label: "Retail" },
    { value: "wholesale", label: "Wholesale" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "services", label: "Professional Services" },
    { value: "construction", label: "Construction" },
    { value: "transportation", label: "Transportation & Logistics" },
    { value: "automotive", label: "Automotive" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "other", label: "Other" }
  ];

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
                const taxNumber = form.getValues("tax_number");
                const otherClassificationValue = form.getValues("business_classification_other");
                
                if (!companyName || !businessClassification || !taxNumber) {
                  return "Please complete all required business information";
                }
                if (businessClassification === "other" && !otherClassificationValue) {
                  return "Please provide a description for Other classification";
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
              required={customerType === "Business"}
              placeholder="Enter company name"
              isModernTheme={isModernTheme}
            />
            
            <FormSelect
              form={form}
              name="business_classification_id"
              label="Business Classification"
              required={customerType === "Business"}
              placeholder="Select business classification"
              options={businessClassificationOptions}
              isModernTheme={isModernTheme}
            />

            {showOtherField && (
              <FormInput
                form={form}
                name="business_classification_other"
                label="Other Classification"
                required={true}
                placeholder="Please specify the business classification"
                isModernTheme={isModernTheme}
                helpText="Please provide details about your business classification"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  saveOtherClassification(e.target.value);
                }}
              />
            )}

            <FormInput
              form={form}
              name="tax_number"
              label="Tax #"
              required={customerType === "Business"}
              placeholder="Enter tax number"
              isModernTheme={isModernTheme}
              helpText="Enter your business tax identification number"
            />
          </div>
        )}
      </div>
    </FormSection>
  );
}
