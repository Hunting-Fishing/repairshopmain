
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function FileUploadSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast.error("Please select a JSON file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const vehicleData = JSON.parse(e.target?.result as string);
          
          const { data: profile } = await supabase.auth.getUser();
          const { data: userData } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", profile.user?.id)
            .single();

          const { error } = await supabase.functions.invoke('import-vehicle-data', {
            body: { 
              vehicleData,
              organizationId: userData.organization_id
            }
          });

          if (error) throw error;

          toast.success("Vehicle data imported successfully");
          setSelectedFile(null);
          
          // Reset file input
          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error("Failed to process vehicle data");
        }
      };

      fileReader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        id="file-upload"
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="min-w-[100px]"
      >
        {isUploading ? (
          "Importing..."
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </>
        )}
      </Button>
    </div>
  );
}
