
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function VehicleDataTab() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingBucketData, setIsLoadingBucketData] = useState(false);

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

  const loadFromBucket = async () => {
    setIsLoadingBucketData(true);
    try {
      const { data, error } = await supabase
        .storage
        .from('RTE MAIN')
        .download('Other/all-vehicles-model.json');
      
      if (error) throw error;

      const jsonData = await data.text();
      const vehicleData = JSON.parse(jsonData);
      
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const { error: importError } = await supabase.functions.invoke('import-vehicle-data', {
        body: { 
          vehicleData,
          organizationId: userData.organization_id
        }
      });

      if (importError) throw importError;

      toast.success("Vehicle data imported successfully from bucket");

    } catch (error) {
      console.error('Error loading from bucket:', error);
      toast.error("Failed to load vehicle data from bucket");
    } finally {
      setIsLoadingBucketData(false);
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Vehicle Data Import</CardTitle>
            <CardDescription>Import vehicle year/make/model data from JSON file</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            disabled={isUploading || isLoadingBucketData}
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isLoadingBucketData}
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
        
        <div className="flex items-center gap-4">
          <Button
            onClick={loadFromBucket}
            disabled={isLoadingBucketData || isUploading}
            variant="secondary"
            className="min-w-[200px]"
          >
            {isLoadingBucketData ? (
              "Loading from bucket..."
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Load from Bucket
              </>
            )}
          </Button>
        </div>
        
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected file: {selectedFile.name}
          </p>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>File requirements:</p>
          <ul className="list-disc list-inside ml-2">
            <li>JSON format</li>
            <li>Array of objects with year, make, and model properties</li>
            <li>Example: [{'"year": "2024", "make": "Toyota", "model": "Camry"'}]</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
