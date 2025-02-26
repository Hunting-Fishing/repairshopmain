
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { AddressBookSection } from "./sections/AddressBookSection";
import { useEffect, useState } from "react";
import { useCustomerDataSave } from "../hooks/useCustomerDataSave";
import { SocialProfilesSection } from "./sections/SocialProfilesSection";
import { ProfileCompletenessSection } from "./sections/ProfileCompletenessSection";
import { BasicInformationSection } from "./sections/BasicInformationSection";
import { PrimaryAddressSection } from "./sections/PrimaryAddressSection";
import { CustomerTypeSection } from "./sections/CustomerTypeSection";
import { AdditionalDetailsSection } from "./sections/AdditionalDetailsSection";
import { PreferencesSection } from "./sections/PreferencesSection";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  customerId: string;
  isModernTheme?: boolean;
}

export function CustomerFormFields({
  form,
  customerId,
  isModernTheme = false,
}: CustomerFormFieldsProps) {
  const [completeness, setCompleteness] = useState({ score: 0, recommendations: [] });
  const { calculateProfileCompleteness } = useCustomerDataSave(customerId);

  useEffect(() => {
    const subscription = form.watch((data) => {
      const result = calculateProfileCompleteness(data as CustomerFormValues);
      setCompleteness({
        score: result.score,
        recommendations: result.recommendations
      });
    });

    return () => subscription.unsubscribe();
  }, [form, calculateProfileCompleteness]);

  // Get the current customer type
  const customerType = form.watch("customer_type");

  return (
    <div className="space-y-8">
      <CustomerTypeSection form={form} isModernTheme={isModernTheme} />
      
      {customerType === "Fleet" && (
        <AdditionalDetailsSection 
          form={form} 
          isModernTheme={isModernTheme} 
          requiredFields={["company_name"]}
        />
      )}

      {customerType === "Business" && (
        <AdditionalDetailsSection 
          form={form} 
          isModernTheme={isModernTheme} 
          requiredFields={["company_name", "business_classification_id", "tax_number"]}
        />
      )}

      <BasicInformationSection form={form} isModernTheme={isModernTheme} />
      
      <PrimaryAddressSection form={form} isModernTheme={isModernTheme} />

      <PreferencesSection form={form} isModernTheme={isModernTheme} />

      <SocialProfilesSection form={form} isModernTheme={isModernTheme} />

      <AddressBookSection form={form} isModernTheme={isModernTheme} />

      <ProfileCompletenessSection 
        score={completeness.score}
        recommendations={completeness.recommendations}
      />
    </div>
  );
}
