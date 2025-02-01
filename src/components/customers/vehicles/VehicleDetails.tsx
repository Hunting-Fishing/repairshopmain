import { Vehicle } from "./types";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  console.log('Vehicle Details Props:', vehicle);

  const categories = {
    "General Information": [
      { label: "VIN", value: vehicle.vin },
      { label: "Make", value: vehicle.make },
      { label: "Model", value: vehicle.model },
      { label: "Year", value: vehicle.year },  // Simply use the year value directly
      { label: "Trim", value: vehicle.trim || "N/A" },
      { label: "Vehicle Type", value: vehicle.engine_info?.vehicle_type || "N/A" },
      { label: "Plant Country", value: vehicle.engine_info?.plant_country || "N/A" },
    ],
    "Engine Information": [
      { 
        label: "Engine", 
        value: vehicle.engine_info?.displacement && vehicle.engine_info?.cylinders
          ? `${vehicle.engine_info.displacement}L ${vehicle.engine_info.cylinders}-cylinder`
          : "N/A"
      },
      { label: "Fuel Type", value: vehicle.engine_info?.fuel_type || "N/A" },
      { label: "Turbo", value: vehicle.engine_info?.turbo || "N/A" },
      { label: "Displacement", value: vehicle.engine_info?.displacement ? `${vehicle.engine_info.displacement}L` : "N/A" },
      { label: "Cylinders", value: vehicle.engine_info?.cylinders || "N/A" },
      { 
        label: "Additional Engine Info", 
        value: vehicle.engine_info?.other_info || "N/A",
        fullWidth: true 
      },
    ],
    "Exterior & Mechanical": [
      { label: "Body Style", value: vehicle.body_class || "N/A" },
      { 
        label: "Drive Type", 
        value: vehicle.engine_info?.drive_type || "N/A",
        fullWidth: true 
      },
      { 
        label: "Gross Vehicle Weight Rating", 
        value: vehicle.engine_info?.gvwr || "N/A",
        fullWidth: true
      },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      {Object.entries(categories).map(([category, fields]) => {
        // Only show categories that have at least one non-N/A value
        const hasData = fields.some(field => field.value && field.value !== "N/A");
        if (!hasData) return null;

        return (
          <div key={category} className={`space-y-3 ${category === "Engine Information" ? "col-span-full md:col-span-2 lg:col-span-1" : ""}`}>
            <h3 className="font-medium text-muted-foreground">{category}</h3>
            <div className="space-y-2">
              {fields.map(({ label, value, fullWidth }) => {
                if (!value || value === "N/A") return null;
                return (
                  <div 
                    key={label} 
                    className={`${fullWidth ? 'col-span-full' : ''}`}
                  >
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};