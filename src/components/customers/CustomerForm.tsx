
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormContainer } from "./form/CustomerFormContainer";
import { CustomerFormValues } from "./types/customerTypes";
import { useToast } from "@/hooks/use-toast";
import { validatePhone, validateEmail, validateAddress, logValidationAttempt } from "@/utils/validation";

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
  timezone: z.string().optional(), // Made explicitly optional
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
      // Validate email
      const emailValidation = await validateEmail(values.email);
      if (!emailValidation.isValid) {
        toast({
          title: "Validation Error",
          description: emailValidation.message,
          variant: "destructive",
        });
        return;
      }

      // Validate phone if provided
      if (values.phone_number) {
        const phoneValidation = await validatePhone(values.phone_number);
        if (!phoneValidation.isValid) {
          toast({
            title: "Validation Error",
            description: phoneValidation.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Validate address if all fields are provided
      if (values.street_address && values.city && values.state_province && values.postal_code && values.country) {
        const addressValidation = await validateAddress(
          values.street_address,
          values.city,
          values.state_province,
          values.postal_code,
          values.country
        );
        if (!addressValidation.isValid) {
          toast({
            title: "Validation Error",
            description: addressValidation.message,
            variant: "destructive",
          });
          return;
        }
      }

      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert([{
          ...values,
          email_validation_status: emailValidation.isValid ? 'valid' : 'invalid',
          phone_validation_status: values.phone_number ? (await validatePhone(values.phone_number)).isValid ? 'valid' : 'invalid' : 'pending',
          address_validation_status: (values.street_address && values.city && values.state_province && values.postal_code && values.country) ? 'valid' : 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Log validation attempts
      await logValidationAttempt(newCustomer.id, 'email', emailValidation.isValid ? 'valid' : 'invalid', emailValidation.message);
      if (values.phone_number) {
        const phoneValidation = await validatePhone(values.phone_number);
        await logValidationAttempt(newCustomer.id, 'phone', phoneValidation.isValid ? 'valid' : 'invalid', phoneValidation.message);
      }
      if (values.street_address) {
        const addressValidation = await validateAddress(
          values.street_address,
          values.city,
          values.state_province,
          values.postal_code,
          values.country
        );
        await logValidationAttempt(newCustomer.id, 'address', addressValidation.isValid ? 'valid' : 'invalid', addressValidation.message);
      }

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
