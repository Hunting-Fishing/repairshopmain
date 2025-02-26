
import { UseFormReturn, useWatch } from "react-hook-form";
import { CustomerFormValues, CustomerType } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Clock, Globe2 } from "lucide-react";
import { SubmitButton } from "../fields/SubmitButton";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

const timezones = [
  { value: "UTC", label: "UTC", country: "" },
  { value: "America/New_York", label: "Eastern Time (ET)", country: "US" },
  { value: "America/Chicago", label: "Central Time (CT)", country: "US" },
  { value: "America/Denver", label: "Mountain Time (MT)", country: "US" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", country: "US" },
  { value: "America/Phoenix", label: "Arizona Time", country: "US" },
  { code: "Europe/London", label: "London", country: "GB" },
  { code: "Europe/Paris", label: "Paris", country: "FR" },
  { code: "Asia/Tokyo", label: "Tokyo", country: "JP" },
  { code: "Asia/Shanghai", label: "Shanghai", country: "CN" },
  { code: "Australia/Sydney", label: "Sydney", country: "AU" }
];

const countryTimezoneMap: Record<string, string> = {
  'US': 'America/New_York',
  'GB': 'Europe/London',
  'FR': 'Europe/Paris',
  'JP': 'Asia/Tokyo',
  'CN': 'Asia/Shanghai',
  'AU': 'Australia/Sydney',
};

const getCurrentTimeInTimezone = (timezone: string) => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
};

interface PreferencesSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function PreferencesSection({
  form,
  isModernTheme = false,
}: PreferencesSectionProps) {
  const { toast } = useToast();
  const country = useWatch({
    control: form.control,
    name: "country"
  });

  const customerType = useWatch({
    control: form.control,
    name: "customer_type"
  });

  useEffect(() => {
    if (country && countryTimezoneMap[country] && !form.getValues('timezone')) {
      form.setValue('timezone', countryTimezoneMap[country]);
    }
  }, [country, form]);

  const validatePersonalCustomer = (data: CustomerFormValues): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.customer_type !== 'Personal') {
      return { isValid: true, errors: [] };
    }

    const requiredFields = {
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email',
      timezone: 'Timezone',
      language_preference: 'Language Preference'
    } as const;

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!data[field as keyof typeof requiredFields]) {
        errors.push(label);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateBusinessCustomer = (data: CustomerFormValues): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.customer_type !== 'Business') {
      return { isValid: true, errors: [] };
    }

    const requiredFields = {
      company_name: 'Company Name',
      email: 'Email',
      timezone: 'Timezone',
      business_classification_id: 'Business Classification',
      company_size: 'Company Size'
    } as const;

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!data[field as keyof typeof requiredFields]) {
        errors.push(label);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (data: CustomerFormValues) => {
    const validCustomerTypes: CustomerType[] = ['Personal', 'Business', 'Fleet'];
    
    if (!validCustomerTypes.includes(data.customer_type)) {
      toast({
        title: "Invalid Customer Type",
        description: `Customer type must be one of: ${validCustomerTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate based on customer type
    const personalValidation = validatePersonalCustomer(data);
    const businessValidation = validateBusinessCustomer(data);

    if (!personalValidation.isValid || !businessValidation.isValid) {
      const errors = [...personalValidation.errors, ...businessValidation.errors];
      toast({
        title: "Required Fields Missing",
        description: `Please fill in the following required fields: ${errors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = form.getValues();
      
      // Additional validation for preferences
      if ((data.customer_type === 'Personal' || data.customer_type === 'Business') 
          && (!formData.timezone || !formData.language_preference)) {
        toast({
          title: "Preferences Required",
          description: "Please select both timezone and language preference",
          variant: "destructive",
        });
        return;
      }

      await form.handleSubmit(() => {})();
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormSection 
          title="Preferences & Contact Settings" 
          description="Customer communication and account preferences"
          isModernTheme={isModernTheme}
        >
          <div className="space-y-6">
            {!customerType && (
              <Alert className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800">
                <AlertDescription>
                  Please select a valid customer type before updating preferences
                </AlertDescription>
              </Alert>
            )}

            {customerType === 'Personal' && (
              <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
                <AlertDescription>
                  Required fields for personal customers: First Name, Last Name, Email, Timezone, and Language Preference
                </AlertDescription>
              </Alert>
            )}

            {customerType === 'Business' && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>
                  Required fields for business customers: Company Name, Email, Business Classification, Company Size, Timezone, and Language Preference
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem
                            key={timezone.value}
                            value={timezone.value}
                            className="cursor-pointer flex items-center justify-between gap-2"
                          >
                            <span>{timezone.label}</span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getCurrentTimeInTimezone(timezone.value)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language_preference"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem
                            key={language.code}
                            value={language.code}
                            className="cursor-pointer flex items-center justify-between gap-2"
                          >
                            <span>{language.name}</span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Globe2 className="h-3 w-3" />
                              <span className="text-xs">{language.native}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
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
                <FormField
                  control={form.control}
                  name="secondary_contact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full p-2 rounded-lg border border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20"
                          placeholder="Enter secondary contact name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondary_contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full p-2 rounded-lg border border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20"
                          placeholder="Enter secondary contact phone"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondary_contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          className="w-full p-2 rounded-lg border border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20"
                          placeholder="Enter secondary contact email"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondary_contact.relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full p-2 rounded-lg border border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20"
                          placeholder="Enter relationship to customer"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </FormSection>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t shadow-lg z-50 transition-all duration-200">
          <div className="container max-w-7xl mx-auto flex justify-end">
            <SubmitButton 
              label="Update Preferences"
              isSubmitting={form.formState.isSubmitting}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
