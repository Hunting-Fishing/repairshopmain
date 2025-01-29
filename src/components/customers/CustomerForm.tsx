import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";

interface CustomerFormProps {
  onSuccess: () => void;
}

interface CustomerFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  notes: string;
}

const FormFields = ({ form }: { form: any }) => (
  <>
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} />
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
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="space-y-4 mt-4">
      <FormField
        control={form.control}
        name="street_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state_province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </>
);

export function CustomerForm({ onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const form = useForm<CustomerFormValues>();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id || !userProfile?.organization_id) {
        throw new Error("User session or organization not found");
      }

      const { error } = await supabase.from("customers").insert({
        ...values,
        organization_id: userProfile.organization_id,
        created_by: session.user.id,
        updated_by: session.user.id,
      });

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding customer",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFields form={form} />
        <Button type="submit" className="w-full">
          Add Customer
        </Button>
      </form>
    </Form>
  );
}