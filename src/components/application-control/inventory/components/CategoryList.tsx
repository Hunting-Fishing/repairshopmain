import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { InventoryCategory } from "../types";

interface CategoryListProps {
  categories: InventoryCategory[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function CategoryList({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  isLoading,
  error 
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[60px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load categories: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

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
        {categories.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No categories found. Click "Add Category" to create one.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}