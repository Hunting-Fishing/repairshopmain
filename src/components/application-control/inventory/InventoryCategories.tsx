import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export function InventoryCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const { userProfile } = useOrganizationData();
  const queryClient = useQueryClient();

  // Query for fetching categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['inventory-categories', userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) {
        console.warn('No organization ID found in user profile');
        return [];
      }
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userProfile?.organization_id
  });

  // Mutation for adding categories
  const { mutateAsync: addCategory, isPending: isAddingCategory } = useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      if (!userProfile?.organization_id) {
        throw new Error("No organization ID found");
      }

      const categoryData = {
        ...input,
        organization_id: userProfile.organization_id
      };

      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      setIsDialogOpen(false);
      toast.success("Category added successfully");
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      toast.error("Failed to add category. Please try again.");
    }
  });

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    console.log("Selected category:", categoryId);
  };

  const handleAddCategory = async (name: string, description?: string) => {
    try {
      await addCategory({ name, description });
    } catch (error) {
      console.error('Error in handleAddCategory:', error);
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
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSubmit={handleAddCategory} isLoading={isAddingCategory} />
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
          <div className="text-center text-muted-foreground py-4">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No categories found. Click the "Add Category" button to create your first category.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {categories.map((category: Category) => (
                <Card 
                  key={category.id}
                  className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
                    selectedCategoryId === category.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
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
        )}
      </CardContent>
    </Card>
  );
}

interface CategoryFormProps {
  onSubmit: (name: string, description?: string) => Promise<void>;
  isLoading: boolean;
}

function CategoryForm({ onSubmit, isLoading }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    await onSubmit(name, description);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
        />
      </div>
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Category"}
      </Button>
    </div>
  );
}