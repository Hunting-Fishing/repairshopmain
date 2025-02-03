import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface SupplierFormProps {
  onSuccess: () => void;
}

export function SupplierForm({ onSuccess }: SupplierFormProps) {
  const form = useForm<SupplierFormData>({
    defaultValues: {
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Supplier name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="Contact person name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Business address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Supplier
        </Button>
      </form>
    </Form>
  );
}