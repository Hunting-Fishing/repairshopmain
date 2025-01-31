import { Vehicle } from "./types";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">VIN</p>
        <p>{vehicle.vin || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Engine Size</p>
        <p>{vehicle.engine_info.displacement ? `${vehicle.engine_info.displacement} L` : 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Cylinders</p>
        <p>{vehicle.engine_info.cylinders || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Fuel Type</p>
        <p>{vehicle.engine_info.fuel_type || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Drive Type</p>
        <p>{vehicle.engine_info.drive_type || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Turbo</p>
        <p>{vehicle.engine_info.turbo || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">GVWR</p>
        <p>{vehicle.engine_info.gvwr || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Body Style</p>
        <p>{vehicle.body_class || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Country of Origin</p>
        <p>{vehicle.engine_info.plant_country || 'Not available'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Vehicle Type</p>
        <p>{vehicle.engine_info.vehicle_type || 'Not available'}</p>
      </div>
      {vehicle.engine_info.other_info && (
        <div className="col-span-2">
          <p className="text-muted-foreground">Engine Details</p>
          <p>{vehicle.engine_info.other_info}</p>
        </div>
      )}
    </div>
  );
};