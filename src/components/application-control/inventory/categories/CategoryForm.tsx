import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddCategory } from "./useAddCategory";
import { toast } from "sonner";

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addCategory, isLoading } = useAddCategory();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      console.log('Submitting category:', { name, description });
      await addCategory({ name, description });
      toast.success("Category added successfully");
      setName("");
      setDescription("");
      onSuccess();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Failed to add category. Please try again.");
    }
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