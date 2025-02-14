
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SpecialtyFormProps {
  onAdd: (specialty: { name: string; level: string }) => void;
}

export function SpecialtyForm({ onAdd }: SpecialtyFormProps) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && level) {
      onAdd({ name, level });
      setName("");
      setLevel("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <Input
          placeholder="Specialty name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={!name || !level}>
        Add Specialty
      </Button>
    </form>
  );
}
