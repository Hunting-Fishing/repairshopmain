import { FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupplierDocument } from "../../../types";

interface DocumentListProps {
  documents: SupplierDocument[];
  onDownload: (fileUrl: string, fileName: string) => void;
  onDelete: (documentId: string, fileUrl: string) => void;
}

export function DocumentList({ documents, onDownload, onDelete }: DocumentListProps) {
  if (!documents.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">{doc.file_name}</span>
            </div>
            {doc.notes && (
              <p className="text-sm text-muted-foreground mt-1">{doc.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(doc.file_url, doc.file_name)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(doc.id, doc.file_url)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}