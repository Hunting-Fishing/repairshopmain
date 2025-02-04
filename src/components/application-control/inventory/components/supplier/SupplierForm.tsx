import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInformation } from "./supplier-form/BasicInformation";
import { ContactDetails } from "./supplier-form/ContactDetails";
import { BusinessDetails } from "./supplier-form/BusinessDetails";

interface SupplierFormProps {
  onSuccess: () => void;
}

export function SupplierForm({ onSuccess }: SupplierFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      tax_id: "",
      currency: "USD",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("Submitting supplier data:", data);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (profileError) {
        console.error("Error fetching organization ID:", profileError);
        throw profileError;
      }

      if (!profileData?.organization_id) {
        throw new Error("No organization ID found");
      }

      const { error } = await supabase
        .from("inventory_suppliers")
        .insert([
          {
            ...data,
            organization_id: profileData.organization_id,
            status: "active",
          },
        ]);

      if (error) {
        console.error("Error adding supplier:", error);
        throw error;
      }

      toast.success("Supplier added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Failed to add supplier");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInformation form={form} />
        <ContactDetails form={form} />
        <BusinessDetails form={form} />
        
        <Button type="submit" className="w-full">
          Add Supplier
        </Button>
      </form>
    </Form>
  );
}