import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleInfoContentProps {
  infoType: 'recalls' | 'safety' | 'complaints' | null;
  vehicleInfo: any;
}

export const VehicleInfoContent = ({ infoType, vehicleInfo }: VehicleInfoContentProps) => {
  if (!vehicleInfo) return null;

  console.log('Vehicle Info in Content:', vehicleInfo);

  switch (infoType) {
    case 'recalls':
      if (!vehicleInfo.results || vehicleInfo.results.length === 0) {
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No recalls found for this vehicle.
            </AlertDescription>
          </Alert>
        );
      }
      return (
        <div className="space-y-4">
          {vehicleInfo.results?.map((recall: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Report Date: {recall.ReportReceivedDate}</h4>
                <Badge variant="destructive">
                  Open Recall
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <span className="text-sm font-medium">Component:</span>
                  <p className="text-sm text-muted-foreground">{recall.Component}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Summary:</span>
                  <p className="text-sm text-muted-foreground">{recall.Summary}</p>
                </div>
                {recall.Consequence && (
                  <div>
                    <span className="text-sm font-medium">Safety Risk:</span>
                    <p className="text-sm text-muted-foreground">{recall.Consequence}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Remedy:</span>
                  <p className="text-sm text-muted-foreground">{recall.Remedy}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Manufacturer Recall Number: {recall.ManufacturerRecallNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    NHTSA Campaign Number: {recall.NHTSACampaignNumber}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'safety':
      return (
        <div className="space-y-4">
          {vehicleInfo.Results?.map((rating: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <h4 className="font-medium">Overall Rating: {rating.OverallRating}</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <p className="text-sm">Frontal Crash: {rating.FrontalCrashRating}</p>
                <p className="text-sm">Side Crash: {rating.SideCrashRating}</p>
                <p className="text-sm">Rollover: {rating.RolloverRating}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case 'complaints':
      return (
        <div className="space-y-4">
          {vehicleInfo.results?.map((complaint: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <h4 className="font-medium">{complaint.components}</h4>
              <p className="text-sm text-muted-foreground">{complaint.summary}</p>
              <p className="text-sm mt-2">Date: {complaint.dateOfIncident}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};