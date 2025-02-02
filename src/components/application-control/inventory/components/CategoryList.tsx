import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryCategory } from "../types";

interface CategoryListProps {
  categories: InventoryCategory[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryList({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: CategoryListProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
              selectedCategoryId === category.id ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}