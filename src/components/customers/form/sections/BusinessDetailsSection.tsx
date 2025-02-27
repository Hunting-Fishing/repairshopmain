
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";
import { FormSelect } from "../fields/FormSelect";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessDetailsSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  showOtherField: boolean;
  onOtherFieldSave: (value: string) => Promise<void>;
}

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

export function BusinessDetailsSection({
  form,
  isModernTheme = false,
  showOtherField,
  onOtherFieldSave
}: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <FormInput
        form={form}
        name="company_name"
        label="Company Name"
        required={true}
        placeholder="Enter company name"
        isModernTheme={isModernTheme}
      />
      
      <FormSelect
        form={form}
        name="business_classification_id"
        label="Business Classification"
        required={true}
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
            onOtherFieldSave(e.target.value);
          }}
        />
      )}

      <FormInput
        form={form}
        name="tax_number"
        label="Tax #"
        required={true}
        placeholder="Enter tax number"
        isModernTheme={isModernTheme}
        helpText="Enter your business tax identification number"
      />
    </div>
  );
}
