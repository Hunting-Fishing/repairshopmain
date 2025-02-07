
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
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]"></span>
                Personal Information
              </h3>
              <div className="bg-gradient-to-br from-white to-[#FDE1D3]/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20 backdrop-blur-sm">
                <CustomerFormFields form={form} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]"></span>
              Address Information
            </h3>
            <div className="bg-gradient-to-br from-white to-[#FDE1D3]/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20 backdrop-blur-sm">
              <CustomerAddressFields form={form} />
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#FEC6A1]/20" />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#EA580C] text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
