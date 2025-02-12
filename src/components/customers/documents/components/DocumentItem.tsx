
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

interface DocumentItemProps {
  doc: {
    id: string;
    name: string;
    notes: string | null;
    file_size: number;
    created_at: string;
    file_url: string;
  };
  onDownload: (fileUrl: string, fileName: string) => void;
  onDelete: (documentId: string, fileUrl: string) => void;
}

export function DocumentItem({ doc, onDownload, onDelete }: DocumentItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{doc.name}</span>
        </div>
        {doc.notes && (
          <p className="text-sm text-muted-foreground mt-1">{doc.notes}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span>{formatFileSize(doc.file_size || 0)}</span>
          <span>{formatDate(doc.created_at)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(doc.file_url, doc.name)}
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
  );
}
