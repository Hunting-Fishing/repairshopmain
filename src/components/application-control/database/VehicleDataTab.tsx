
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
      // First check if the file exists
      const { data: fileList, error: listError } = await supabase
        .storage
        .from('vehicle_data')
        .list();
      
      if (listError) {
        console.error('Error listing bucket files:', listError);
        throw new Error('Could not access vehicle data storage');
      }

      if (!fileList || fileList.length === 0) {
        throw new Error('No vehicle data file found in storage');
      }

      // Get the first JSON file from the bucket
      const jsonFile = fileList.find(file => file.name.endsWith('.json'));
      if (!jsonFile) {
        throw new Error('No JSON file found in storage');
      }

      console.log('Attempting to download file:', jsonFile.name);
      
      const { data, error } = await supabase
        .storage
        .from('vehicle_data')
        .download(jsonFile.name);
      
      if (error) {
        console.error('Error downloading file:', error);
        throw error;
      }

      const jsonData = await data.text();
      console.log('File downloaded, parsing JSON data');
      
      const vehicleData = JSON.parse(jsonData);
      if (!Array.isArray(vehicleData)) {
        throw new Error('Invalid vehicle data format');
      }
      
      console.log(`Parsed ${vehicleData.length} vehicle records`);

      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) {
        throw new Error('No authenticated user found');
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Could not fetch organization information');
      }

      console.log('Importing vehicle data for organization:', userData.organization_id);

      const { error: importError } = await supabase.functions.invoke('import-vehicle-data', {
        body: { 
          vehicleData,
          organizationId: userData.organization_id
        }
      });

      if (importError) {
        console.error('Import function error:', importError);
        throw importError;
      }

      toast.success(`Successfully imported ${vehicleData.length} vehicle records`);

    } catch (error) {
      console.error('Error in loadFromBucket:', error);
      toast.error(error.message || "Failed to load vehicle data from bucket");
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
