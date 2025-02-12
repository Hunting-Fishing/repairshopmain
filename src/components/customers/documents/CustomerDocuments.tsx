
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { DocumentUploadForm } from "./components/DocumentUploadForm";
import { DocumentList } from "./components/DocumentList";

interface CustomerDocumentsProps {
  customerId: string;
}

export function CustomerDocuments({ customerId }: CustomerDocumentsProps) {
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: documents, refetch } = useQuery({
    queryKey: ["customer-documents", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_documents")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      if (!userData?.organization_id) {
        throw new Error("Organization ID not found");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${userData.organization_id}/${customerId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("customer-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("customer-documents")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("customer_documents")
        .insert({
          customer_id: customerId,
          organization_id: userData.organization_id,
          name: file.name,
          file_url: publicUrl,
          file_type: fileExt,
          file_size: file.size,
          notes: notes.trim() || null,
          created_by: profile.user?.id,
        });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      setNotes("");
      refetch();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (documentId: string, fileUrl: string) => {
    try {
      const filePath = fileUrl.split("/").pop();
      
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("customer-documents")
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from("customer_documents")
        .delete()
        .eq("id", documentId);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
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
          <DocumentUploadForm
            notes={notes}
            uploading={uploading}
            onNotesChange={setNotes}
            onFileSelect={handleFileUpload}
          />
          <DocumentList
            documents={documents || []}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
}
