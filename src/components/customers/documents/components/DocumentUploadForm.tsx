
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { validateFile, FILE_RESTRICTIONS } from "@/utils/validation/fieldValidation";
import { toast } from "sonner";

interface DocumentUploadFormProps {
  notes: string;
  uploading: boolean;
  onNotesChange: (notes: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentUploadForm({ notes, uploading, onNotesChange, onFileSelect }: DocumentUploadFormProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);

      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileSelect(event);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);

      if (!validation.isValid) {
        toast.error(validation.message);
        e.target.value = '';
        return;
      }

      onFileSelect(e);
    }
  };

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

      <div 
        className={cn(
          "flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none",
          dragActive ? "border-primary" : "border-gray-300"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-600">
            Drag and drop a file or click to select
          </span>
          <span className="text-xs text-gray-500">
            Supported formats: {Object.values(FILE_RESTRICTIONS.allowedTypes).flat().join(', ')}
          </span>
          <span className="text-xs text-gray-500">
            Max size: {FILE_RESTRICTIONS.maxSize / 1024 / 1024}MB
          </span>
        </div>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={Object.values(FILE_RESTRICTIONS.allowedTypes).flat().join(',')}
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
      </div>
    </div>
  );
}
