
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CustomerRelationshipFormValues } from "../types/customerTypes";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CustomerSearch } from "../search/CustomerSearch";

interface CustomerRelationshipDialogProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerRelationshipDialog({
  customerId,
  open,
  onOpenChange
}: CustomerRelationshipDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const form = useForm<CustomerRelationshipFormValues>({
    defaultValues: {
      relationship_type: "family",
      is_primary: false,
      notes: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: CustomerRelationshipFormValues) => {
      if (!selectedCustomerId) throw new Error("No customer selected");

      const { error } = await supabase
        .from("customer_relationships")
        .insert([{
          parent_customer_id: customerId,
          related_customer_id: selectedCustomerId,
          relationship_type: values.relationship_type,
          is_primary: values.is_primary,
          notes: values.notes
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-relationships"] });
      onOpenChange(false);
      toast({
        title: "Relationship created",
        description: "The relationship has been created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create relationship: " + error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: CustomerRelationshipFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Related Customer</Label>
                <CustomerSearch
                  onSelect={(customer) => setSelectedCustomerId(customer.id)}
                  excludeIds={[customerId]}
                />
              </div>

              <div className="space-y-2">
                <Label>Relationship Type</Label>
                <Select
                  onValueChange={(value) => form.setValue("relationship_type", value as any)}
                  defaultValue={form.getValues("relationship_type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-primary"
                  checked={form.watch("is_primary")}
                  onCheckedChange={(checked) => form.setValue("is_primary", checked)}
                />
                <Label htmlFor="is-primary">Primary Relationship</Label>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  {...form.register("notes")}
                  placeholder="Add any notes about this relationship..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!selectedCustomerId || createMutation.isPending}
              >
                Add Relationship
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
