
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { InventoryBatchOperation } from "../types";

export function useBatchOperations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createBatchOperation = useMutation({
    mutationFn: async (data: {
      operation_type: InventoryBatchOperation['operation_type'];
      items: string[];
      metadata?: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('inventory_batch_operations')
        .insert([{
          operation_type: data.operation_type,
          items: data.items,
          created_by: user?.id,
          metadata: data.metadata || {},
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Batch operation created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create batch operation: ' + error.message);
    },
  });

  return {
    createBatchOperation,
  };
}
