
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { CustomerTypeSection } from "../sections/CustomerTypeSection";
import { CustomerTypeContent } from "./CustomerTypeContent";
import { BasicInformationSection } from "../sections/BasicInformationSection";
import { PrimaryAddressSection } from "../sections/PrimaryAddressSection";
import { PreferencesSection } from "../sections/PreferencesSection";
import { SocialProfilesSection } from "../sections/SocialProfilesSection";
import { AddressBookSection } from "../sections/AddressBookSection";
import { ProfileCompletenessSection } from "../sections/ProfileCompletenessSection";

interface CustomerFormContentProps {
  form: UseFormReturn<CustomerFormValues>;
  customerType: string | undefined;
  completeness: { score: number; recommendations: string[] };
  isModernTheme?: boolean;
}

export function CustomerFormContent({
  form,
  customerType,
  completeness,
  isModernTheme = false,
}: CustomerFormContentProps) {
  return (
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
  );
}
