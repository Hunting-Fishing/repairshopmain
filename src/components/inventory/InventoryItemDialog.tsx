import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { CategorySupplierFields } from "./form/CategorySupplierFields";
import { QuantityPriceFields } from "./form/QuantityPriceFields";
import { InventoryItemFormData } from "./types";

export function InventoryItemDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<InventoryItemFormData>();

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([data]);

      if (error) throw error;
      
      toast.success('Inventory item created successfully');
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      setOpen(false);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast.error('Failed to create inventory item');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            <CategorySupplierFields form={form} />
            <QuantityPriceFields form={form} />
            <Button type="submit" className="w-full">Create Item</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}