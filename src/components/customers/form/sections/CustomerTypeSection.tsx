
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Building2, Users2, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BusinessDetailsSection } from "./BusinessDetailsSection";

interface CustomerTypeOption {
  value: string;
  label: string;
  icon: React.ComponentType;
  description?: string;
}

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  title?: string;
  description?: string;
  options?: CustomerTypeOption[];
  isModernTheme?: boolean;
}

const defaultOptions: CustomerTypeOption[] = [
  {
    value: "B2B",
    label: "Business to Business",
    icon: Building2,
    description: "For companies selling to other businesses"
  },
  {
    value: "B2C",
    label: "Business to Consumer",
    icon: Users2,
    description: "For companies selling directly to consumers"
  },
  {
    value: "Both",
    label: "Both B2B and B2C",
    icon: Store,
    description: "For companies serving both businesses and consumers"
  }
];

export function CustomerTypeSection({
  form,
  title = "Customer Type",
  description = "Select your primary business model",
  options = defaultOptions,
  isModernTheme = false
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

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className={cn(
            "text-2xl font-semibold tracking-tight",
            isModernTheme ? "text-gray-900" : "text-gray-800"
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              "text-sm",
              isModernTheme ? "text-gray-600" : "text-gray-500"
            )}>
              {description}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="customer_type"
          rules={{
            required: "Please select a customer type"
          }}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-4 pt-2"
                >
                  {options.map((option) => {
                    const Icon = option.icon;
                    return (
                      <FormItem
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-3 space-y-0 rounded-lg border p-4",
                          "transition-all duration-200",
                          field.value === option.value
                            ? isModernTheme
                              ? "border-orange-500 bg-orange-50/50"
                              : "border-orange-200 bg-orange-50/30"
                            : "hover:border-gray-300"
                        )}
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <div className="flex-1 space-y-1">
                          <FormLabel className="flex items-center gap-2">
                            <Icon className={cn(
                              "h-4 w-4",
                              field.value === option.value
                                ? "text-orange-500"
                                : "text-gray-500"
                            )} />
                            <span className={cn(
                              "font-medium",
                              field.value === option.value
                                ? "text-orange-900"
                                : "text-gray-900"
                            )}>
                              {option.label}
                            </span>
                          </FormLabel>
                          {option.description && (
                            <p className={cn(
                              "text-sm",
                              field.value === option.value
                                ? "text-orange-700"
                                : "text-gray-500"
                            )}>
                              {option.description}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {customerType === "Business" && (
          <BusinessDetailsSection
            form={form}
            isModernTheme={isModernTheme}
            showOtherField={showOtherField}
            onOtherFieldSave={saveOtherClassification}
          />
        )}
      </div>
    </div>
  );
}
