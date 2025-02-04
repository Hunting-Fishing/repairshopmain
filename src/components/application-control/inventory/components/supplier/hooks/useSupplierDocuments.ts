import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SupplierDocument } from "../../../types";

export function useSupplierDocuments(supplierId: string, organizationId?: string) {
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('supplier_documents')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, [supplierId]);

  const uploadDocument = async (file: File, notes?: string) => {
    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${supplierId}/${crypto.randomUUID()}.${fileExt}`;

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
          supplier_id: supplierId,
          organization_id: organizationId,
          document_type: fileExt,
          file_name: file.name,
          file_url: publicUrl,
          notes: notes?.trim() || null,
          status: 'active'
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const deleteDocument = async (documentId: string, fileUrl: string) => {
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
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  return {
    documents,
    isLoading,
    fetchDocuments,
    uploadDocument,
    deleteDocument
  };
}