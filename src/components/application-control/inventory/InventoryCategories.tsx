import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from "./categories/AddCategoryDialog";
import { CategoryList } from "./categories/CategoryList";
import { useInventoryCategories } from "./categories/useInventoryCategories";
import { useState } from "react";

export function InventoryCategories() {
  const { categories } = useInventoryCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // You can add additional logic here when a category is selected
    console.log("Selected category:", categoryId);
  };

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
        <CategoryList 
          categories={categories} 
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </CardContent>
    </Card>
  );
}