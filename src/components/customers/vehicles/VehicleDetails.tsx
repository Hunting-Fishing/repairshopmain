import { Vehicle } from "./types";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const categories = {
    "General Information": [
      { label: "VIN", value: vehicle.vin },
      { label: "Make", value: vehicle.make },
      { label: "Model", value: vehicle.model },
      { label: "Year", value: vehicle.year },
      { label: "Trim", value: vehicle.trim },
      { label: "Vehicle Type", value: vehicle.engine_info?.vehicle_type },
      { label: "Plant Country", value: vehicle.engine_info?.plant_country },
    ],
    "Engine Information": [
      { 
        label: "Engine", 
        value: vehicle.engine_info?.displacement && vehicle.engine_info?.cylinders
          ? `${vehicle.engine_info.displacement}L ${vehicle.engine_info.cylinders}-cylinder`
          : null 
      },
      { label: "Fuel Type", value: vehicle.engine_info?.fuel_type },
      { label: "Turbo", value: vehicle.engine_info?.turbo ? "Yes" : "No" },
      { label: "Displacement", value: vehicle.engine_info?.displacement ? `${vehicle.engine_info.displacement}L` : null },
      { label: "Cylinders", value: vehicle.engine_info?.cylinders },
      { 
        label: "Additional Engine Info", 
        value: vehicle.engine_info?.other_info,
        fullWidth: true 
      },
    ],
    "Exterior & Mechanical": [
      { label: "Body Style", value: vehicle.body_class },
      { label: "Drive Type", value: vehicle.engine_info?.drive_type },
      { 
        label: "Gross Vehicle Weight Rating", 
        value: vehicle.engine_info?.gvwr || "Class 2H: 9,001 - 10,000 lb (4,082 - 4,536 kg)",
        fullWidth: true
      },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      {Object.entries(categories).map(([category, fields]) => {
        const hasData = fields.some(field => field.value);
        if (!hasData) return null;

        return (
          <div key={category} className={`space-y-3 ${category === "Engine Information" ? "col-span-full md:col-span-2 lg:col-span-1" : ""}`}>
            <h3 className="font-medium text-muted-foreground">{category}</h3>
            <div className="space-y-2">
              {fields.map(({ label, value, fullWidth }) => {
                if (!value) return null;
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