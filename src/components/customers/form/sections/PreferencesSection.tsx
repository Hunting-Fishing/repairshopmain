
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreferencesSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function PreferencesSection({
  form,
  isModernTheme = false,
}: PreferencesSectionProps) {
  return (
    <FormSection 
      title="Preferences & Contact Settings" 
      description="Customer communication and account preferences"
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            form={form}
            name="timezone"
            label="Timezone"
            placeholder="Select timezone"
            helpText="Customer's local timezone for communications"
            isModernTheme={isModernTheme}
          />
          <FormInput
            form={form}
            name="language_preference"
            label="Preferred Language"
            placeholder="Select language"
            helpText="Customer's preferred language for communications"
            isModernTheme={isModernTheme}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Marketing Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="email-marketing"
                checked={form.watch("marketing_preferences.email")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.email", checked)
                }
              />
              <Label htmlFor="email-marketing">Email Marketing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sms-marketing"
                checked={form.watch("marketing_preferences.sms")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.sms", checked)
                }
              />
              <Label htmlFor="sms-marketing">SMS Marketing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="phone-marketing"
                checked={form.watch("marketing_preferences.phone")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.phone", checked)
                }
              />
              <Label htmlFor="phone-marketing">Phone Marketing</Label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Secondary Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              form={form}
              name="secondary_contact.name"
              label="Contact Name"
              placeholder="Enter secondary contact name"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.phone"
              label="Contact Phone"
              placeholder="Enter secondary contact phone"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.email"
              label="Contact Email"
              placeholder="Enter secondary contact email"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.relationship"
              label="Relationship"
              placeholder="Enter relationship to customer"
              isModernTheme={isModernTheme}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
