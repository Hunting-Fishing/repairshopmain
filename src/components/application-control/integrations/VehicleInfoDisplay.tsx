import { VehicleInfo } from "./NhtsaVinDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VehicleInfoDisplayProps {
  vehicleInfo: VehicleInfo;
}

export const VehicleInfoDisplay = ({ vehicleInfo }: VehicleInfoDisplayProps) => {
  if (!vehicleInfo || Object.keys(vehicleInfo).length === 0) return null;

  // Organize fields into categories
  const categories = {
    "Vehicle Information": [
      { label: "Make", value: vehicleInfo.Make },
      { label: "Model", value: vehicleInfo.Model },
      { label: "Model Year", value: vehicleInfo.ModelYear },
      { label: "Production Date", value: vehicleInfo.ProductionDate },
      { label: "Trim", value: vehicleInfo.Trim },
      { label: "Body Style", value: vehicleInfo["Body Class"] },
      { label: "Vehicle Type", value: vehicleInfo.VehicleType },
    ],
    "Engine & Drivetrain": [
      { 
        label: "Engine", 
        value: vehicleInfo["Engine Number of Cylinders"] && vehicleInfo["Displacement (L)"]
          ? `${vehicleInfo["Displacement (L)"]}L ${vehicleInfo["Engine Number of Cylinders"]}-cylinder`
          : null
      },
      { label: "Fuel Type", value: vehicleInfo["Fuel Type - Primary"] },
      { label: "Drive Type", value: vehicleInfo["Drive Type"] },
      { label: "Turbo", value: vehicleInfo.Turbo },
      { label: "Additional Info", value: vehicleInfo["Other Engine Info"] },
    ],
    "Manufacturing": [
      { label: "Plant Country", value: vehicleInfo["Plant Country"] },
      { label: "GVWR", value: vehicleInfo["Gross Vehicle Weight Rating"] },
    ]
  };

  return (
    <ScrollArea className="h-[400px] mt-4">
      <div className="space-y-6">
        {Object.entries(categories).map(([category, fields]) => {
          // Only show categories that have at least one non-empty value
          const hasData = fields.some(field => field.value);
          if (!hasData) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="font-medium text-muted-foreground">{category}</h3>
              <div className="grid grid-cols-1 gap-4">
                {fields.map(({ label, value }) => {
                  if (!value) return null;
                  return (
                    <div key={label} className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p className="text-sm mt-1">{value}</p>
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