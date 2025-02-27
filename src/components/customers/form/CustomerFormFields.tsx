
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const { calculateProfileCompleteness } = useCustomerDataSave(customerId);
  const { isDirty, isSaving, discardChanges } = useCustomerAutosave(form, customerId, true);
  const { toast } = useToast();
  const customerType = form.watch("customer_type");
  const dirtyFields = Object.keys(form.formState.dirtyFields).length;

  // Show warning when navigating away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

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

  const handleDiscardChanges = () => {
    setShowDiscardDialog(true);
  };

  return (
    <div className="space-y-8">
      <FormNotifications 
        customerType={customerType} 
        isSaving={isSaving}
        completionPercentage={completeness.score}
        dirtyFields={dirtyFields}
      />

      <div role="form" aria-label="Customer Information Form">
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

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                discardChanges();
                setShowDiscardDialog(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
