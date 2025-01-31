export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  body_class: string;
  engine_info: {
    cylinders: string;
    displacement: string;
    fuel_type: string;
    other_info: string;
    drive_type: string;
    gvwr: string;
    manufacturer: string;
    plant_country: string;
    vehicle_type: string;
  };
}