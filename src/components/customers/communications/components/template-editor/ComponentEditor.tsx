
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTemplateComponents } from "../../hooks/useTemplateComponents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "../RichTextEditor";

const CATEGORIES = [
  "Header",
  "Footer",
  "Body",
  "Call to Action",
  "Signature",
  "Other"
];

export function ComponentEditor() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const { createComponent } = useTemplateComponents();

  const handleSubmit = () => {
    if (!name || !content) return;

    createComponent.mutateAsync({
      name,
      category,
      content,
      organization_id: "", // This will be set by the RLS policy
      metadata: {},
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter component name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create Component
      </Button>
    </div>
  );
}
