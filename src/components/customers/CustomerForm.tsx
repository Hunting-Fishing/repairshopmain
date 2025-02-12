
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormContainer } from "./form/CustomerFormContainer";
import { CustomerFormValues } from "./types/customerTypes";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <CustomerFormContainer 
      form={form} 
      onSubmit={onSubmit} 
      mode={mode} 
    />
  );
}
