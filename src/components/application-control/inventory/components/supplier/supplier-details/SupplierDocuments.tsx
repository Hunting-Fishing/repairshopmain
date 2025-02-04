import { useState, useCallback } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSupplierRealtime } from "../hooks/useSupplierRealtime";
import { supabase } from "@/integrations/supabase/client";
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

  // Setup realtime updates
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

  const handleDeleteDocument = async (documentId: string, fileUrl: string) => {
    try {
      // Extract the path from the URL
      const filePath = fileUrl.split('/').pop();
      
      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('supplier-documents')
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      // Delete from database
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
          <div className="space-y-4">
            <div>
              <Label>Document Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            {documents.length > 0 ? (
              documents.map((doc) => (
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
                      onClick={() => handleDownload(doc.file_url, doc.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No documents uploaded yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}