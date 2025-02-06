
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadSection } from "./vehicle-data/FileUploadSection";
import { LoadFromBucketSection } from "./vehicle-data/LoadFromBucketSection";
import { RequirementsSection } from "./vehicle-data/RequirementsSection";

export function VehicleDataTab() {
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
        <FileUploadSection />
        <LoadFromBucketSection />
        <RequirementsSection />
      </CardContent>
    </Card>
  );
}
