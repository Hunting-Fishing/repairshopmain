interface VehicleInfoContentProps {
  infoType: 'recalls' | 'safety' | 'complaints' | null;
  vehicleInfo: any;
}

export const VehicleInfoContent = ({ infoType, vehicleInfo }: VehicleInfoContentProps) => {
  if (!vehicleInfo) return null;

  switch (infoType) {
    case 'recalls':
      return (
        <div className="space-y-4">
          {vehicleInfo.results?.map((recall: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <h4 className="font-medium">{recall.Component}</h4>
              <p className="text-sm text-muted-foreground">{recall.Summary}</p>
              <p className="text-sm mt-2">Consequence: {recall.Consequence}</p>
              <p className="text-sm">Remedy: {recall.Remedy}</p>
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