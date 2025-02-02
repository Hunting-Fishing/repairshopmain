import { useState } from "react";
import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useInventoryData } from "./hooks/useInventoryData";
import type { InventoryCategory, CategoryFormData } from "./types";

interface InventoryCategoriesProps {
  categories: InventoryCategory[];
  isLoading?: boolean;
  error?: Error | null;
}

export function InventoryCategories({ categories, isLoading, error }: InventoryCategoriesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addCategory } = useInventoryData();
  const form = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await addCategory(data);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load categories: {error.message}
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
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            Add Category
          </Button>
        </div>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <h3 className="font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              )}
            </Card>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No categories found. Add your first category to get started.
            </p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    {...form.register("name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Category</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}