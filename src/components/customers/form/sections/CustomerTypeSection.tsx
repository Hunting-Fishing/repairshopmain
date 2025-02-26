
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { CustomerTypeSelect } from "../fields/CustomerTypeSelect";
import { FormInput } from "../fields/FormInput";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Hash } from "lucide-react";

const businessClassifications = [
  { id: "corp", name: "Corporation" },
  { id: "llc", name: "Limited Liability Company" },
  { id: "partner", name: "Partnership" },
  { id: "sole", name: "Sole Proprietorship" },
  { id: "nonprofit", name: "Non-Profit Organization" }
];

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" }
];

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  isModernTheme = false,
}: CustomerTypeSectionProps) {
  return (
    <FormSection 
      title="Customer Type" 
      description="Select the type of customer and related information"
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <CustomerTypeSelect 
          form={form} 
          isModernTheme={isModernTheme} 
        />

        {form.watch("customer_type") === "Business" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <FormInput
              form={form}
              name="company_name"
              label="Company Name"
              placeholder="Enter company name"
              helpText="Legal business name as registered"
              required
              isModernTheme={isModernTheme}
              icon={<Building2 className="h-4 w-4 text-gray-500" />}
            />

            <FormInput
              form={form}
              name="pst_number"
              label="PST Number"
              placeholder="Enter PST number"
              helpText="Provincial Sales Tax number"
              required
              isModernTheme={isModernTheme}
              icon={<Hash className="h-4 w-4 text-gray-500" />}
            />

            <FormField
              control={form.control}
              name="business_classification_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Business Classification
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessClassifications.map((classification) => (
                        <SelectItem
                          key={classification.id}
                          value={classification.id}
                          className="cursor-pointer"
                        >
                          {classification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Company Size
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                        <SelectValue placeholder="Select company size">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {field.value}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem
                          key={size.value}
                          value={size.value}
                          className="cursor-pointer"
                        >
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
}
