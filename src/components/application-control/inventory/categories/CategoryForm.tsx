import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddCategory } from "./useAddCategory";

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addCategory } = useAddCategory();

  const handleSubmit = async () => {
    await addCategory({ name, description });
    setName("");
    setDescription("");
    onSuccess();
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
      <Button onClick={handleSubmit} className="w-full">
        Add Category
      </Button>
    </div>
  );
}