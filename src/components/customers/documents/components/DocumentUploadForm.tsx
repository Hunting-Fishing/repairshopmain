
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface DocumentUploadFormProps {
  notes: string;
  uploading: boolean;
  onNotesChange: (notes: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentUploadForm({ notes, uploading, onNotesChange, onFileSelect }: DocumentUploadFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Document Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes about this document..."
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={uploading}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={onFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
        />
      </div>
    </div>
  );
}
