import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

      // Filter out aftermarket part recalls and format dates
      const relevantRecalls = vehicleInfo.results?.filter((recall: any) => {
        // Exclude recalls that are specifically for aftermarket parts
        const isAftermarket = recall.Summary?.toLowerCase().includes('aftermarket') ||
                            recall.Manufacturer?.toLowerCase().includes('aftermarket');
        return !isAftermarket;
      });

      if (relevantRecalls.length === 0) {
        return (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>
              No active recalls found for this vehicle.
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div className="space-y-4">
          {relevantRecalls.map((recall: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  Report Date: {new Date(recall.ReportReceivedDate).toLocaleDateString()}
                </h4>
                <Badge variant="destructive">
                  Safety Recall
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
                    Manufacturer: {recall.Manufacturer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    NHTSA Campaign Number: {recall.NHTSACampaignNumber}
                  </p>
                  {recall.ManufacturerRecallNumber && (
                    <p className="text-xs text-muted-foreground">
                      Manufacturer Recall Number: {recall.ManufacturerRecallNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'safety':
      if (!vehicleInfo.Results || vehicleInfo.Results.length === 0) {
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No safety ratings found for this vehicle.
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div className="space-y-6">
          {vehicleInfo.Results?.map((rating: any, index: number) => (
            <div key={index} className="border p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {rating.VehicleDescription || 'Overall Safety Rating'}
                </h3>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {rating.OverallRating || 'N/A'}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frontal Crash</span>
                    <span className="font-medium">{rating.FrontalCrashRating || 'N/A'}/5</span>
                  </div>
                  <Progress value={rating.FrontalCrashRating ? (rating.FrontalCrashRating / 5) * 100 : 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Side Crash</span>
                    <span className="font-medium">{rating.SideCrashRating || 'N/A'}/5</span>
                  </div>
                  <Progress value={rating.SideCrashRating ? (rating.SideCrashRating / 5) * 100 : 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rollover</span>
                    <span className="font-medium">{rating.RolloverRating || 'N/A'}/5</span>
                  </div>
                  <Progress value={rating.RolloverRating ? (rating.RolloverRating / 5) * 100 : 0} />
                </div>
              </div>

              {rating.ComplaintsCount !== undefined && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Complaints Filed</span>
                    <span>{rating.ComplaintsCount}</span>
                  </div>
                </div>
              )}

              {rating.RecallsCount !== undefined && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total Recalls</span>
                    <span>{rating.RecallsCount}</span>
                  </div>
                </div>
              )}
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
