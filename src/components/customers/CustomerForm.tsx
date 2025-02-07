
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { CustomerFormValues } from "./types/customerTypes";
import { Separator } from "@/components/ui/separator";
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="bg-white/80 rounded-lg p-6 shadow-sm border border-gray-100">
                <CustomerFormFields form={form} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
            <div className="bg-white/80 rounded-lg p-6 shadow-sm border border-gray-100">
              <CustomerAddressFields form={form} />
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white px-8"
          >
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
