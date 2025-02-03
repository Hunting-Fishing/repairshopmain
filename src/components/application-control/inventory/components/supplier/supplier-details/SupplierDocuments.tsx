import { File, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupplierDocuments } from "../hooks/useSupplierDocuments";
import { toast } from "sonner";
import type { InventorySupplier } from "../../../types";

interface SupplierDocumentsProps {
  supplier: InventorySupplier;
}

export function SupplierDocuments({ supplier }: SupplierDocumentsProps) {
  const [uploading, setUploading] = useState(false);
  const { documents, isLoading, uploadDocument, deleteDocument } = useSupplierDocuments(supplier.id);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadDocument(file);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <File className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" disabled={uploading}>
            <label className="cursor-pointer flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading documents...</div>
        ) : documents?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No documents uploaded</div>
        ) : (
          <div className="space-y-2">
            {documents?.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span>{doc.file_name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}