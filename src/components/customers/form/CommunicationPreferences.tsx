
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { LanguageSelector } from "./preferences/LanguageSelector";
import { TimezoneSelector } from "./preferences/TimezoneSelector";
import { MarketingPreferences } from "./preferences/MarketingPreferences";

interface CommunicationPreferencesProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CommunicationPreferences = ({ form, isModernTheme = false }: CommunicationPreferencesProps) => {
  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Communication Preferences</h3>
      
      <LanguageSelector form={form} labelClasses={labelClasses} />
      <TimezoneSelector form={form} labelClasses={labelClasses} />
      <MarketingPreferences form={form} labelClasses={labelClasses} />
    </div>
  );
};
