import { useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventorySupplier } from "../../../types";

interface SupplierDocumentsProps {
  supplier: InventorySupplier;
}

export function SupplierDocuments({ supplier }: SupplierDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);

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

      const { error: dbError } = await supabase
        .from('supplier_documents')
        .insert({
          supplier_id: supplier.id,
          organization_id: supplier.organization_id,
          document_type: 'general',
          file_name: file.name,
          file_url: filePath,
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
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
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>
          
          <div className="grid gap-2">
            {/* Document list will be implemented here */}
            <div className="text-sm text-muted-foreground text-center py-4">
              No documents uploaded yet
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}