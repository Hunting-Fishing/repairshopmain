import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSupplierDocuments(supplierId: string) {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["supplier-documents", supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_documents")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const uploadDocument = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${supplierId}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("supplier-documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("supplier-documents")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from("supplier_documents")
      .insert({
        supplier_id: supplierId,
        document_type: fileExt,
        file_name: file.name,
        file_url: publicUrl,
      });

    if (dbError) throw dbError;

    queryClient.invalidateQueries({ queryKey: ["supplier-documents", supplierId] });
  };

  const deleteDocument = async (documentId: string) => {
    const { error } = await supabase
      .from("supplier_documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      toast.error("Failed to delete document");
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["supplier-documents", supplierId] });
    toast.success("Document deleted successfully");
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
  };
}