import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from "./categories/AddCategoryDialog";
import { CategoryList } from "./categories/CategoryList";
import { useInventoryCategories } from "./categories/useInventoryCategories";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function InventoryCategories() {
  const { categories, isLoading, error, organizationId } = useInventoryCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    console.log("Selected category:", categoryId);
  };

  if (!organizationId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Organization ID not found. Please ensure you are properly logged in.
        </AlertDescription>
      </Alert>
    );
  }

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
          <div className="text-center text-destructive py-4">
            Error loading categories. Please try refreshing the page.
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground py-4">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No categories found. Click the "Add Category" button to create your first category.
          </div>
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