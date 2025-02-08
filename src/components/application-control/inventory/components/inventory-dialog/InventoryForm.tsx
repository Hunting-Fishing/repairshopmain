
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventoryFormSubmit } from "./useInventoryFormSubmit";
import { InventoryReviewChanges } from "./InventoryReviewChanges";
import type { InventoryItem } from "../../types";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryForm({ item, onSubmit }: InventoryFormProps) {
  const form = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      quantity_in_stock: item?.quantity_in_stock || 0,
      unit_cost: item?.unit_cost || 0,
      reorder_point: item?.reorder_point || 0,
    },
  });

  const { handleSubmit, isSubmitting, changes } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity_in_stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity in Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Cost</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reorder_point"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Point</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {changes && <InventoryReviewChanges changes={changes} />}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
