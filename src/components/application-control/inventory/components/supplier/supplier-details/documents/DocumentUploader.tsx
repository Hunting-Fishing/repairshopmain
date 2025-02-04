import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DocumentUploaderProps {
  isUploading: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentUploader({ 
  isUploading, 
  notes, 
  onNotesChange, 
  onFileSelect 
}: DocumentUploaderProps) {
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
          disabled={isUploading}
          onClick={() => document.getElementById('file-upload')?.click()}
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