
import * as z from "zod";

// Define the types from our database
type UnitOfMeasure = 'Each' | 'Pair' | 'Set' | 'Litre' | 'Gallon' | 'Quart' | 'Ounce' | 
                     'Milliliter' | 'Gram' | 'Kilogram' | 'Pound' | 'Foot' | 'Meter' | 
                     'Inch' | 'Box' | 'Case' | 'Roll' | 'Sheet';

type InventoryItemStatus = 'active' | 'inactive' | 'needs_attention';

type AutomotiveCategory = 'Electrical' | 'Brakes' | 'Suspension' | 'Fluids' | 'Steering' |
                         'Engine' | 'Transmission' | 'Exhaust' | 'HVAC' | 'Body' |
                         'Lighting' | 'Filters' | 'Accessories' | 'Tools' | 'Other';

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity_in_stock: z.number().min(0, "Quantity cannot be negative").default(0),
  unit_cost: z.number().min(0, "Cost cannot be negative").default(0),
  selling_price: z.number().min(0, "Price cannot be negative").default(0),
  markup_percentage: z.number().min(0).max(1000).default(0),
  reorder_point: z.number().min(0, "Reorder point cannot be negative").default(0),
  reorder_quantity: z.number().min(0, "Reorder quantity cannot be negative").optional(),
  sku: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive', 'needs_attention'] as [InventoryItemStatus, ...InventoryItemStatus[]]).default('active'),
  image_url: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  barcode: z.string().optional(),
  unit_of_measure: z.enum(['Each', 'Pair', 'Set', 'Litre', 'Gallon', 'Quart', 'Ounce', 
    'Milliliter', 'Gram', 'Kilogram', 'Pound', 'Foot', 'Meter', 
    'Inch', 'Box', 'Case', 'Roll', 'Sheet'] as [UnitOfMeasure, ...UnitOfMeasure[]]).default('Each'),
  lead_time_days: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  date_received: z.string().optional(),
  purchase_order_number: z.string().optional(),
  sales_order_number: z.string().optional(),
  return_info: z.string().optional(),
  notes: z.string().optional(),
  preferred_vendor: z.string().optional(),
  upc_ean: z.string().optional(),
  automotive_category: z.enum(['Electrical', 'Brakes', 'Suspension', 'Fluids', 'Steering',
    'Engine', 'Transmission', 'Exhaust', 'HVAC', 'Body',
    'Lighting', 'Filters', 'Accessories', 'Tools', 'Other'] as [AutomotiveCategory, ...AutomotiveCategory[]]).default('Other')
});

export type InventoryFormSchema = z.infer<typeof inventoryItemSchema>;
