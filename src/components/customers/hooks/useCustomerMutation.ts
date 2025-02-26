
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerFormValues } from "../types/customerTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCustomerMutation(customerId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateField = useMutation({
    mutationFn: async ({ field, value }: { field: keyof CustomerFormValues; value: any }) => {
      const { data, error } = await supabase
        .from('customers')
        .update({ [field]: value })
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ field, value }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['customer', customerId] });
      const previousCustomer = queryClient.getQueryData<CustomerFormValues>(['customer', customerId]);

      // Optimistically update the customer data
      if (previousCustomer) {
        queryClient.setQueryData(['customer', customerId], {
          ...previousCustomer,
          [field]: value,
        });
      }

      return { previousCustomer };
    },
    onError: (err, variables, context) => {
      // On error, rollback the optimistic update
      if (context?.previousCustomer) {
        queryClient.setQueryData(['customer', customerId], context.previousCustomer);
      }
      toast({
        title: "Error saving changes",
        description: "Your changes couldn't be saved. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });

  const updateMultipleFields = useMutation({
    mutationFn: async (updates: Partial<CustomerFormValues>) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customer', customerId] });
      const previousCustomer = queryClient.getQueryData<CustomerFormValues>(['customer', customerId]);

      // Optimistically update
      if (previousCustomer) {
        queryClient.setQueryData(['customer', customerId], {
          ...previousCustomer,
          ...updates,
        });
      }

      return { previousCustomer };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCustomer) {
        queryClient.setQueryData(['customer', customerId], context.previousCustomer);
      }
      toast({
        title: "Error saving changes",
        description: "Your changes couldn't be saved. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });

  return {
    updateField: updateField.mutateAsync,
    updateMultipleFields: updateMultipleFields.mutateAsync,
    isSaving: updateField.isPending || updateMultipleFields.isPending,
  };
}
