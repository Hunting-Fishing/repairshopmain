import { VehicleInfo } from "./NhtsaVinDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VehicleInfoDisplayProps {
  vehicleInfo: VehicleInfo;
}

export const VehicleInfoDisplay = ({ vehicleInfo }: VehicleInfoDisplayProps) => {
  if (!vehicleInfo || Object.keys(vehicleInfo).length === 0) return null;

  // Filter out empty values and organize fields
  const fields = Object.entries(vehicleInfo)
    .filter(([_, value]) => value && value !== "null" && value !== "Not Applicable" && value.trim() !== "")
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <ScrollArea className="h-[400px] mt-4">
      <div className="space-y-4">
        <h3 className="font-medium">Vehicle Information:</h3>
        <div className="grid grid-cols-1 gap-4">
          {fields.map(([field, value]) => (
            <div key={field} className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">{field}</p>
              <p className="text-sm mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};