import { useState } from "react";
import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { CategoryForm } from "./components/CategoryForm";
import { CategoryList } from "./components/CategoryList";
import { useCategories } from "./hooks/useCategories";
import type { CategoryFormData } from "./types";

export function InventoryCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const { userProfile } = useOrganizationData();
  
  const {
    categories,
    isLoading,
    error,
    addCategory,
    isAddingCategory
  } = useCategories(userProfile?.organization_id);

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await addCategory(data);
      setIsDialogOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      console.error('Error in handleAddCategory:', error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  if (!userProfile?.organization_id) {
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
              Add Category
            </Button>
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
        </div>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-destructive py-4">
            Error loading categories. Please try refreshing the page.
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground py-4">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No categories found. Click the "Add Category" button to create your first category.
          </div>
        ) : (
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        )}
      </CardContent>
    </Card>
  );
}