import { VehicleInfo } from "./NhtsaVinDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VehicleInfoDisplayProps {
  vehicleInfo: VehicleInfo;
}

export const VehicleInfoDisplay = ({ vehicleInfo }: VehicleInfoDisplayProps) => {
  if (!vehicleInfo || Object.keys(vehicleInfo).length === 0) return null;

  // Group the information into categories
  const categories = {
    "General Information": [
      "VIN",
      "Make",
      "Model",
      "ModelYear",
      "Trim",
      "VehicleType",
      "Series",
      "Series2"
    ],
    "Engine Specifications": [
      "Engine Number of Cylinders",
      "Displacement (L)",
      "Fuel Type - Primary",
      "Engine Configuration",
      "Turbo"
    ],
    "Vehicle Details": [
      "Body Class",
      "Drive Type",
      "Gross Vehicle Weight Rating"
    ]
  };

  return (
    <ScrollArea className="h-[300px] mt-4">
      <div className="space-y-4">
        <h3 className="font-medium">Vehicle Information:</h3>
        {Object.entries(categories).map(([category, fields]) => {
          const hasData = fields.some(field => vehicleInfo[field]);
          if (!hasData) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
              <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-4 rounded-lg">
                {fields.map(field => {
                  if (!vehicleInfo[field]) return null;
                  return (
                    <div key={field} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{field}</p>
                      <p className="text-sm">{vehicleInfo[field]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};