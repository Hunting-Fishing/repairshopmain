import { useState, useCallback } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSupplierRealtime } from "../hooks/useSupplierRealtime";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploader } from "./documents/DocumentUploader";
import { DocumentList } from "./documents/DocumentList";
import type { InventorySupplier, SupplierDocument } from "../../../types";

interface SupplierDocumentsProps {
  supplier: InventorySupplier;
}

export function SupplierDocuments({ supplier }: SupplierDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [notes, setNotes] = useState("");

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from('supplier_documents')
      .select('*')
      .eq('supplier_id', supplier.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    setDocuments(data || []);
  }, [supplier.id]);

  useSupplierRealtime(supplier.id, fetchDocuments);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${supplier.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('supplier-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('supplier-documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('supplier_documents')
        .insert({
          supplier_id: supplier.id,
          organization_id: supplier.organization_id,
          document_type: fileExt,
          file_name: file.name,
          file_url: publicUrl,
          notes: notes.trim() || null,
          status: 'active'
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
      setNotes("");
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId: string, fileUrl: string) => {
    try {
      const filePath = fileUrl.split('/').pop();
      
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('supplier-documents')
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('supplier_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DocumentUploader
            isUploading={isUploading}
            notes={notes}
            onNotesChange={setNotes}
            onFileSelect={handleFileUpload}
          />
          
          <DocumentList
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDeleteDocument}
          />
        </div>
      </CardContent>
    </Card>
  );
}