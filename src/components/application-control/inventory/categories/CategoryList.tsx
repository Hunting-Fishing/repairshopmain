import { Button } from "@/components/ui/button";
import { useInventoryCategories } from "./useInventoryCategories";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { useState } from "react";
import { toast } from "sonner";

interface CategoryListProps {
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryList({ categories, selectedCategoryId, onSelectCategory }: CategoryListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!categories) {
    return <div>No categories available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4 grid gap-4">
          {categories.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              No categories found. Click "Add Category" to create one.
            </Card>
          ) : (
            categories.map((category) => (
              <Card 
                key={category.id} 
                className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
                  selectedCategoryId === category.id ? 'bg-accent' : ''
                }`}
                onClick={() => onSelectCategory(category.id)}
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <AddCategoryDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}