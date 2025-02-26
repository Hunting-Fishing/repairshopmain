
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentCategory } from "../types";

export function DocumentCategoryManager() {
  const [newCategory, setNewCategory] = useState("");

  const { data: categories, refetch } = useQuery({
    queryKey: ["document-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as DocumentCategory[];
    }
  });

  const handleAddCategory = async () => {
    const trimmedName = newCategory.trim();
    
    if (!trimmedName) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from("document_categories")
        .insert({ name: trimmedName });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("A category with this name already exists");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Category added successfully");
      setNewCategory("");
      refetch();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="flex-1"
        />
        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      {categories?.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No document categories created yet
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 rounded-md border bg-card"
          >
            <span>{category.name}</span>
            {category.description && (
              <span className="text-sm text-muted-foreground">
                {category.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
