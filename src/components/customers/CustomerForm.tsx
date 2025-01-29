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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: any;
  mode?: "create" | "edit";
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

export function CustomerForm({ onSuccess, initialData, mode = "create" }: CustomerFormProps) {
  const { toast } = useToast();
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  
  const form = useForm<CustomerFormValues>({
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
      notes: "",
    },
  });

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

  const createHistoryRecords = async (
    customerId: string,
    userId: string,
    changes: Record<string, { old: any; new: any }>,
    notes: string
  ) => {
    const historyRecords = Object.entries(changes).map(([field, values]) => ({
      customer_id: customerId,
      changed_by: userId,
      change_type: mode === "create" ? "create" : "update",
      field_name: field,
      old_value: values.old?.toString() || null,
      new_value: values.new?.toString() || null,
      notes,
    }));

    const { error } = await supabase
      .from("customer_history")
      .insert(historyRecords);

    if (error) throw error;
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id || !userProfile?.organization_id) {
        throw new Error("User session or organization not found");
      }

      // Calculate changes if in edit mode
      if (mode === "edit") {
        const changes: Record<string, { old: any; new: any }> = {};
        Object.keys(values).forEach((key) => {
          if (values[key as keyof CustomerFormValues] !== initialData[key]) {
            changes[key] = {
              old: initialData[key],
              new: values[key as keyof CustomerFormValues],
            };
          }
        });

        if (Object.keys(changes).length > 0) {
          setPendingChanges({
            values,
            changes,
            userId: session.user.id,
          });
          setShowNotesDialog(true);
          return;
        }
      }

      // If creating or no changes detected, proceed without notes
      await saveCustomer(values, session.user.id, "");
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Error ${mode === "create" ? "adding" : "updating"} customer`,
        description: error.message,
      });
    }
  };

  const saveCustomer = async (values: CustomerFormValues, userId: string, notes: string) => {
    const { data, error } = mode === "create"
      ? await supabase
          .from("customers")
          .insert({
            ...values,
            organization_id: userProfile?.organization_id,
            created_by: userId,
            updated_by: userId,
          })
          .select()
          .single()
      : await supabase
          .from("customers")
          .update({
            ...values,
            updated_by: userId,
          })
          .eq("id", initialData.id)
          .select()
          .single();

    if (error) throw error;

    if (mode === "edit" && pendingChanges) {
      await createHistoryRecords(
        initialData.id,
        userId,
        pendingChanges.changes,
        notes
      );
    } else if (mode === "create" && data) {
      await createHistoryRecords(
        data.id,
        userId,
        Object.keys(values).reduce((acc, key) => ({
          ...acc,
          [key]: { old: null, new: values[key as keyof CustomerFormValues] },
        }), {}),
        "Initial customer creation"
      );
    }
  };

  const handleNotesSubmit = async () => {
    if (!pendingChanges) return;

    try {
      await saveCustomer(
        pendingChanges.values,
        pendingChanges.userId,
        changeNotes
      );
      setShowNotesDialog(false);
      setPendingChanges(null);
      setChangeNotes("");
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating customer",
        description: error.message,
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormFields form={form} />
          <Button type="submit" className="w-full">
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </form>
      </Form>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Change Notes</DialogTitle>
            <DialogDescription>
              Please provide any notes about the changes you're making
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter notes about your changes (optional)"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNotesDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleNotesSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}