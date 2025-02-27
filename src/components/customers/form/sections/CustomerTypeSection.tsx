
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CustomerTypeOptionItem } from "./customer-type/CustomerTypeOption";
import { defaultOptions, CustomerTypeOption } from "./customer-type/options";
import { useCustomerType } from "./customer-type/useCustomerType";
import { BusinessDetailsSection } from "./BusinessDetailsSection";

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  title?: string;
  description?: string;
  options?: CustomerTypeOption[];
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  title = "Account Type",
  description = "Select your account type",
  options = defaultOptions,
  isModernTheme = false
}: CustomerTypeSectionProps) {
  const { customerType, showOtherField, saveOtherClassification } = useCustomerType(form);

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
          rules={{ required: "Please select a customer type" }}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-4 pt-2"
              >
                {options.map((option) => (
                  <CustomerTypeOptionItem
                    key={option.value}
                    option={option}
                    isSelected={field.value === option.value}
                    isModernTheme={isModernTheme}
                  />
                ))}
              </RadioGroup>
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
