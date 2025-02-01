import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from "./categories/AddCategoryDialog";
import { CategoryList } from "./categories/CategoryList";
import { useInventoryCategories } from "./categories/useInventoryCategories";

export function InventoryCategories() {
  const { categories } = useInventoryCategories();

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
        <CategoryList categories={categories} />
      </CardContent>
    </Card>
  );
}