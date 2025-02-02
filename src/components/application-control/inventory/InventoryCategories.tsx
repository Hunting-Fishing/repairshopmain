import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from "./categories/AddCategoryDialog";
import { CategoryList } from "./categories/CategoryList";
import { useInventoryCategories } from "./categories/useInventoryCategories";
import { useState } from "react";

export function InventoryCategories() {
  const { categories, isLoading, error } = useInventoryCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    console.log("Selected category:", categoryId);
  };

  console.log('Current categories:', categories);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5" />
            <CardTitle>Categories</CardTitle>
          </div>
          <AddCategoryDialog />
        </div>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-destructive py-4">Error loading categories</div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground py-4">Loading categories...</div>
        ) : (
          <CategoryList 
            categories={categories} 
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        )}
      </CardContent>
    </Card>
  );
}