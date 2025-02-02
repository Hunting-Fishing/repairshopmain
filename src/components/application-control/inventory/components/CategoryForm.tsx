import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CategoryFormData } from "../types";

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
}

export function CategoryForm({ onSubmit, isLoading }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    await onSubmit({ name, description });
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