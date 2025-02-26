
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CustomerFormFields } from "./CustomerFormFields";
import { CustomerAddressFields } from "./CustomerAddressFields";
import { BusinessFormFields } from "./BusinessFormFields";
import { CommunicationPreferences } from "./CommunicationPreferences";
import { FormSection } from "./FormSection";
import { EditModeAlert } from "./EditModeAlert";
import { SubmitButton } from "./fields/SubmitButton";
import { useFormContext } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { useTheme } from "@/contexts/ThemeContext";

interface CustomerFormContainerProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  mode?: "create" | "edit";
  isSubmitting?: boolean;
  customerId: string;
}

export function CustomerFormContainer({ 
  onSubmit, 
  mode = "create", 
  isSubmitting = false,
  customerId 
}: CustomerFormContainerProps) {
  const { isModernTheme, toggleTheme } = useTheme();
  const form = useFormContext<CustomerFormValues>();

  const themeClass = isModernTheme ? "modern-theme" : "basic-theme";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className={`space-y-8 animate-fade-in ${themeClass}`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {mode === "edit" && <EditModeAlert />}

        <div className="flex items-center justify-end gap-2 mb-6">
          <Label htmlFor="theme-toggle" className="text-sm font-medium">
            {isModernTheme ? "Modern" : "Basic"} Theme
          </Label>
          <Switch
            id="theme-toggle"
            checked={isModernTheme}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-gradient-to-r from-[#F97316] to-[#EA580C]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormSection
              title="Personal Information"
              isModernTheme={isModernTheme}
            >
              <CustomerFormFields 
                form={form} 
                isModernTheme={isModernTheme} 
                customerId={customerId}
              />
            </FormSection>
          </div>

          <div className="space-y-6">
            <FormSection
              title="Address Information"
              isModernTheme={isModernTheme}
            >
              <CustomerAddressFields form={form} isModernTheme={isModernTheme} />
            </FormSection>

            <FormSection
              title="Communication Preferences"
              isModernTheme={isModernTheme}
            >
              <CommunicationPreferences form={form} isModernTheme={isModernTheme} />
            </FormSection>
          </div>
        </div>

        <Separator className={isModernTheme ? 'bg-orange-200/50' : 'bg-[#FEC6A1]/20'} />
        
        <div className="flex justify-end">
          <SubmitButton 
            label={mode === "create" ? "Add Customer" : "Update Customer"}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
