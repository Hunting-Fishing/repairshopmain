
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
import { useCustomerAutosave } from "../hooks/useCustomerAutosave";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  
  // Get the current customer type
  const customerType = form.watch("customer_type");
  const formErrors = form.formState.errors;

  useEffect(() => {
    if (!customerType) {
      toast({
        title: "Customer Type Required",
        description: "Please select a customer type to continue",
        variant: "destructive",
      });
    }
  }, [customerType]);

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
      {!customerType && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a customer type to continue
          </AlertDescription>
        </Alert>
      )}

      <CustomerTypeSection form={form} isModernTheme={isModernTheme} />
      
      {customerType === "Fleet" && (
        <AdditionalDetailsSection 
          form={form} 
          isModernTheme={isModernTheme} 
          requiredFields={[]}
        />
      )}

      {customerType === "Business" && (
        <AdditionalDetailsSection 
          form={form} 
          isModernTheme={isModernTheme} 
          requiredFields={[]}
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

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg">
          Saving changes...
        </div>
      )}
    </div>
  );
}
