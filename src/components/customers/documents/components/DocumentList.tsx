
import { DocumentItem } from "./DocumentItem";

interface DocumentListProps {
  documents: any[];
  onDownload: (fileUrl: string, fileName: string) => void;
  onDelete: (documentId: string, fileUrl: string) => void;
}

export function DocumentList({ documents, onDownload, onDelete }: DocumentListProps) {
  if (!documents?.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
