
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { BusinessFormFields } from "./form/BusinessFormFields";
import { CommunicationPreferences } from "./form/CommunicationPreferences";
import { CustomerFormValues } from "./types/customerTypes";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string().optional(),
  company_size: z.string().optional(),
  business_classification_id: z.string().optional(),
  preferred_contact_time: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  secondary_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    relationship: z.string().optional()
  }).optional(),
  marketing_preferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    phone: z.boolean()
  }).optional()
});

export interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: CustomerFormValues;
  mode?: "create" | "edit";
}

export function CustomerForm({ onSuccess, initialData, mode = "create" }: CustomerFormProps) {
  const { toast } = useToast();
  const [isModernTheme, setIsModernTheme] = useState(false);
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      street_address: "",
      city: "",
      state_province: "",
      postal_code: "",
      country: "",
      customer_type: "Personal",
      language_preference: "en",
      marketing_preferences: {
        email: false,
        sms: false,
        phone: false
      }
    },
  });

  const customerType = form.watch("customer_type");

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const { error } = await supabase
        .from("customers")
        .insert([values]);

      if (error) throw error;

      onSuccess();
      toast({
        title: "Success",
        description: "Customer has been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const themeClass = isModernTheme ? "modern-theme" : "basic-theme";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-8 animate-fade-in ${themeClass}`}>
        {mode === "edit" && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-700">
              <p className="text-sm font-medium">Edit Mode</p>
              <p className="text-xs">You are currently editing this customer's information.</p>
            </div>
          </div>
        )}

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
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
              }`}>
                <span className={`p-1.5 rounded-full ${
                  isModernTheme 
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C]' 
                    : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
                }`}></span>
                Personal Information
              </h3>
              <div className={`rounded-lg p-6 ${
                isModernTheme
                  ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
              }`}>
                <CustomerFormFields form={form} isModernTheme={isModernTheme} />
              </div>
            </div>

            {customerType === "Business" && (
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
                }`}>
                  <span className={`p-1.5 rounded-full ${
                    isModernTheme 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C]' 
                      : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
                  }`}></span>
                  Business Information
                </h3>
                <div className={`rounded-lg p-6 ${
                  isModernTheme
                    ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
                }`}>
                  <BusinessFormFields form={form} isModernTheme={isModernTheme} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
              }`}>
                <span className={`p-1.5 rounded-full ${
                  isModernTheme 
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C]' 
                    : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
                }`}></span>
                Address Information
              </h3>
              <div className={`rounded-lg p-6 ${
                isModernTheme
                  ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
              }`}>
                <CustomerAddressFields form={form} isModernTheme={isModernTheme} />
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
              }`}>
                <span className={`p-1.5 rounded-full ${
                  isModernTheme 
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C]' 
                    : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
                }`}></span>
                Communication Preferences
              </h3>
              <div className={`rounded-lg p-6 ${
                isModernTheme
                  ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
              }`}>
                <CommunicationPreferences form={form} isModernTheme={isModernTheme} />
              </div>
            </div>
          </div>
        </div>

        <Separator className={`my-8 ${isModernTheme ? 'bg-orange-200/50' : 'bg-[#FEC6A1]/20'}`} />
        
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
