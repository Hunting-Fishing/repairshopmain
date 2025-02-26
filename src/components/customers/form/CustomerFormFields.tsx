
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

  return (
    <div className="space-y-8">
      <ProfileCompletenessSection 
        score={completeness.score}
        recommendations={completeness.recommendations}
      />

      <BasicInformationSection form={form} isModernTheme={isModernTheme} />
      
      <PrimaryAddressSection form={form} isModernTheme={isModernTheme} />
      
      <CustomerTypeSection form={form} isModernTheme={isModernTheme} />

      <SocialProfilesSection form={form} isModernTheme={isModernTheme} />

      <AddressBookSection form={form} isModernTheme={isModernTheme} />

      <AdditionalDetailsSection form={form} isModernTheme={isModernTheme} />
    </div>
  );
}
