
import * as z from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity_in_stock: z.number().min(0, "Quantity cannot be negative"),
  unit_cost: z.number().min(0, "Cost cannot be negative"),
  reorder_point: z.number().min(0, "Reorder point cannot be negative"),
  sku: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive", "needs_attention"]),
  image_url: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional()
});

export type InventoryFormSchema = z.infer<typeof inventoryItemSchema>;
