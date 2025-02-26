
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function LoadFromBucketSection() {
  const [isLoadingBucketData, setIsLoadingBucketData] = useState(false);

  const loadFromBucket = async () => {
    setIsLoadingBucketData(true);
    try {
      console.log('Attempting to download file: all-vehicles-model.json');
      
      const { data, error } = await supabase
        .storage
        .from('vehicle_data')
        .download('all-vehicles-model.json');
      
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

  return (
    <Button
      onClick={loadFromBucket}
      disabled={isLoadingBucketData}
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
  );
}
