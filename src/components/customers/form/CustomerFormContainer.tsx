
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CustomerFormFields } from "./CustomerFormFields";
import { CustomerAddressFields } from "./CustomerAddressFields";
import { BusinessFormFields } from "./BusinessFormFields";
import { CommunicationPreferences } from "./CommunicationPreferences";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { EditModeAlert } from "./EditModeAlert";

interface CustomerFormContainerProps {
  form: UseFormReturn<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  mode?: "create" | "edit";
}

export function CustomerFormContainer({ form, onSubmit, mode = "create" }: CustomerFormContainerProps) {
  const [isModernTheme, setIsModernTheme] = useState(false);
  const customerType = form.watch("customer_type");

  const themeClass = isModernTheme ? "modern-theme" : "basic-theme";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-8 animate-fade-in ${themeClass}`}>
        {mode === "edit" && <EditModeAlert />}

        <div className="flex items-center justify-end gap-2 mb-6">
          <Label htmlFor="theme-toggle" className="text-sm font-medium">
            {isModernTheme ? "Modern" : "Basic"} Theme
          </Label>
          <Switch
            id="theme-toggle"
            checked={isModernTheme}
            onCheckedChange={setIsModernTheme}
            className="data-[state=checked]:bg-gradient-to-r from-[#F97316] to-[#EA580C]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormSection
              title="Personal Information"
              isModernTheme={isModernTheme}
            >
              <CustomerFormFields form={form} isModernTheme={isModernTheme} />
            </FormSection>

            {customerType === "Business" && (
              <FormSection
                title="Business Information"
                isModernTheme={isModernTheme}
              >
                <BusinessFormFields form={form} isModernTheme={isModernTheme} />
              </FormSection>
            )}
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
          <Button 
            type="submit" 
            className={`w-full md:w-auto px-8 shadow-lg hover:shadow-xl transition-all duration-200 ${
              isModernTheme
                ? 'bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] hover:from-[#EA580C] hover:via-[#C2410C] hover:to-[#9A3412] text-white border border-orange-400/50'
                : 'bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#EA580C] text-white'
            }`}
          >
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
