
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

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
                disabled={uploading}
                onClick={() => document.getElementById("file-upload")?.click()}
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

          <div className="space-y-2">
            {documents?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
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
                    onClick={() => handleDownload(doc.file_url, doc.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {!documents?.length && (
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
