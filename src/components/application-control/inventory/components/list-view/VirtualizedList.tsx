
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { InventoryItem } from "../../types";
import { InventoryCard } from "../InventoryCard";

interface VirtualizedListProps {
  items: InventoryItem[];
  selectedItems: string[];
  onSelectItem: (itemId: string, selected: boolean) => void;
  onEditItem: (item: InventoryItem) => void;
}

export function VirtualizedList({ 
  items, 
  selectedItems, 
  onSelectItem, 
  onEditItem 
}: VirtualizedListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef} 
      className="h-[800px] overflow-auto bg-white rounded-lg shadow-sm border"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 absolute top-0 left-0 w-full">
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <InventoryCard
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelect={(selected) => onSelectItem(item.id, selected)}
                  onEdit={() => onEditItem(item)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
