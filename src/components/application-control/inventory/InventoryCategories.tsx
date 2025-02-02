import { useState } from "react";
import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./components/CategoryForm";
import { CategoryList } from "./components/CategoryList";
import { useInventoryData } from "./hooks/useInventoryData";
import type { InventoryCategory } from "./types";

interface InventoryCategoriesProps {
  categories: InventoryCategory[];
  isLoading?: boolean;
  error?: Error | null;
}

export function InventoryCategories({ categories, isLoading, error }: InventoryCategoriesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const { addCategory, isAddingCategory } = useInventoryData();

  const handleAddCategory = async (data: { name: string; description?: string }) => {
    try {
      await addCategory(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5" />
            <CardTitle>Categories</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            Add Category
          </Button>
        </div>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          isLoading={isLoading}
          error={error}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleAddCategory}
              isLoading={isAddingCategory}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}