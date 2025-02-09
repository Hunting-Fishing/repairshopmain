
import type { InventoryItem } from "../../types";

export function logInventoryProblems(items: InventoryItem[]) {
  const problems = items.reduce((issues, item) => {
    if (item.quantity_in_stock === 0) {
      issues.outOfStock.push(item.name);
    } else if (item.quantity_in_stock < (item.reorder_point || 10)) {
      issues.lowStock.push(item.name);
    }
    if (!item.supplier_id) {
      issues.noSupplier.push(item.name);
    }
    if (item.unit_cost === null || item.unit_cost === 0) {
      issues.noCost.push(item.name);
    }
    return issues;
  }, {
    outOfStock: [] as string[],
    lowStock: [] as string[],
    noSupplier: [] as string[],
    noCost: [] as string[]
  });

  console.log('Inventory Analysis:', {
    total: items.length,
    problems,
    totalValue: items.reduce((sum, item) => 
      sum + ((item.quantity_in_stock || 0) * (item.unit_cost || 0)), 0
    ),
  });
}
