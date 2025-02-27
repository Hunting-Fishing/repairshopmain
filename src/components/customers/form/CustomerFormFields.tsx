
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { useEffect, useState } from "react";
import { useCustomerDataSave } from "../hooks/useCustomerDataSave";
import { useCustomerAutosave } from "../hooks/useCustomerAutosave";
import { useToast } from "@/hooks/use-toast";
import { FormNotifications } from "./components/FormNotifications";
import { CustomerTypeContent } from "./components/CustomerTypeContent";
import { CustomerTypeSection } from "./sections/CustomerTypeSection";
import { BasicInformationSection } from "./sections/BasicInformationSection";
import { PrimaryAddressSection } from "./sections/PrimaryAddressSection";
import { PreferencesSection } from "./sections/PreferencesSection";
import { SocialProfilesSection } from "./sections/SocialProfilesSection";
import { AddressBookSection } from "./sections/AddressBookSection";
import { ProfileCompletenessSection } from "./sections/ProfileCompletenessSection";

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
  const { isDirty, isSaving } = useCustomerAutosave(form, customerId, true);
  const { toast } = useToast();
  const customerType = form.watch("customer_type");

  useEffect(() => {
    if (!customerType) {
      toast({
        title: "Customer Type Required",
        description: "Please select a customer type to continue",
        variant: "destructive",
      });
    }
  }, [customerType, toast]);

  useEffect(() => {
    const subscription = form.watch((data) => {
      const result = calculateProfileCompleteness(data as CustomerFormValues);
      setCompleteness(result);
    });
    return () => subscription.unsubscribe();
  }, [form, calculateProfileCompleteness]);

  return (
    <div className="space-y-8">
      <FormNotifications customerType={customerType} isSaving={isSaving} />
      <CustomerTypeSection form={form} isModernTheme={isModernTheme} />
      <CustomerTypeContent form={form} customerType={customerType} isModernTheme={isModernTheme} />
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
