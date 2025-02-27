
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Building2, Users2, Store } from "lucide-react";

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
                  {options.map((option) => (
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
                          <option.icon className={cn(
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
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
