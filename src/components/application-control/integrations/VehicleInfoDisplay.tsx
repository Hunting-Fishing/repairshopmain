import { VehicleInfo } from "./NhtsaVinDialog";

interface VehicleInfoDisplayProps {
  vehicleInfo: VehicleInfo;
}

export const VehicleInfoDisplay = ({ vehicleInfo }: VehicleInfoDisplayProps) => {
  if (!vehicleInfo || Object.keys(vehicleInfo).length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-medium">Vehicle Information:</h3>
      <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-4 rounded-lg">
        {Object.entries(vehicleInfo).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{key}</p>
            <p className="text-sm">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};