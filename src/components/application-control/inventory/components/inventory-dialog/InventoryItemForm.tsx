
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { InventoryReviewChanges } from "./InventoryReviewChanges";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { QuantitySection } from "./form-sections/QuantitySection";
import { ReorderSection } from "./form-sections/ReorderSection";
import { StatusSection } from "./form-sections/StatusSection";
import { ImageSection } from "./form-sections/ImageSection";
import { inventoryItemSchema } from "./form-sections/validation";
import type { InventoryItem, InventoryItemFormData } from "../../types";
import { toast } from "sonner";

interface InventoryItemFormProps {
  item?: InventoryItem;
  onSubmit: (data: InventoryItemFormData) => void;
  onCancel: () => void;
}

export function InventoryItemForm({ item, onSubmit, onCancel }: InventoryItemFormProps) {
  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      quantity_in_stock: item?.quantity_in_stock || 0,
      unit_cost: item?.unit_cost || 0,
      reorder_point: item?.reorder_point || 0,
      sku: item?.sku || "",
      location: item?.location || "",
      status: item?.status || "active",
      image_url: item?.image_url || "",
      category_id: item?.category_id,
      supplier_id: item?.supplier_id,
    },
  });

  const { handleSubmit, isSubmitting, changes } = useInventoryFormSubmit({
    form,
    onSubmit: async (data) => {
      try {
        await onSubmit(data);
        toast.success(item ? "Item updated successfully" : "Item added successfully");
      } catch (error) {
        toast.error("Failed to save item. Please try again.");
        console.error("Form submission error:", error);
      }
    },
    originalData: item,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <QuantitySection form={form} />
        <ReorderSection form={form} />
        <StatusSection form={form} />
        <ImageSection form={form} />

        {changes && <InventoryReviewChanges changes={changes} />}

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-[150px]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-[150px]"
          >
            {isSubmitting ? "Saving..." : item ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
