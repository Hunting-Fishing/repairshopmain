
interface InventoryStatsProps {
  items: any[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
        <span className="font-medium">{items.length}</span>
        <span>items</span>
      </div>
      <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
        <span className="font-medium">
          {items.filter(item => item.status === 'needs_attention').length}
        </span>
        <span>urgent</span>
      </div>
      <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
        <span className="font-medium">
          {items.filter(item => item.quantity_in_stock <= (item.reorder_point || 5)).length}
        </span>
        <span>low stock</span>
      </div>
    </div>
  );
}
