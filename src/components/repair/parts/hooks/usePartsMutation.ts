
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PartFormData } from "../types/parts";

export function usePartsMutation(repairJobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPart: PartFormData) => {
      const inventoryItem = await supabase
        .from('inventory_items')
        .select('unit_cost')
        .eq('id', newPart.inventory_item_id)
        .single();

      if (!inventoryItem.data) throw new Error("Part not found");

      const { error } = await supabase
        .from('repair_job_parts')
        .insert({
          repair_job_id: repairJobId,
          inventory_item_id: newPart.inventory_item_id,
          quantity: newPart.quantity,
          unit_price: inventoryItem.data.unit_cost,
          total_price: inventoryItem.data.unit_cost * newPart.quantity,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-parts'] });
      toast.success("Part added successfully");
    },
    onError: () => {
      toast.error("Failed to add part");
    }
  });
}
