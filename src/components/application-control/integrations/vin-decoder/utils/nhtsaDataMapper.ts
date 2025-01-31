import { VehicleInfo } from "../../NhtsaVinDialog";

interface NhtsaResult {
  Variable: string;
  Value: string | null;
}

interface NhtsaResponse {
  Results?: NhtsaResult[];
}

export const mapNhtsaDataToVehicleInfo = (data: NhtsaResponse, vin: string): VehicleInfo => {
  if (!data?.Results || !Array.isArray(data.Results)) {
    throw new Error('Invalid NHTSA data format');
  }

  const vehicleData: VehicleInfo = {
    Make: '',
    Model: '',
    ModelYear: '',
    Series: '',
    Series2: '',
    Trim: '',
    VIN: vin,
    BodyClass: '',
    DisplacementL: '',
    EngineConfiguration: '',
    EngineCylinders: '',
    EngineHP: '',
    FuelTypePrimary: '',
    GVWR: '',
    DriveType: '',
    Manufacturer: '',
    PlantCity: '',
    PlantCountry: '',
    PlantState: '',
    TransmissionStyle: '',
    VehicleType: ''
  };

  data.Results.forEach((result: NhtsaResult) => {
    const value = result.Value;
    if (value && value !== "null" && value !== "Not Applicable") {
      switch (result.Variable) {
        case "Make":
          vehicleData.Make = value;
          break;
        case "Model":
          vehicleData.Model = value;
          break;
        case "Model Year":
          vehicleData.ModelYear = value;
          break;
        case "Trim":
          vehicleData.Trim = value;
          break;
        case "Body Class":
          vehicleData.BodyClass = value;
          break;
        case "Displacement (L)":
          vehicleData.DisplacementL = value;
          break;
        case "Engine Configuration":
          vehicleData.EngineConfiguration = value;
          break;
        case "Engine Number of Cylinders":
          vehicleData.EngineCylinders = value;
          break;
        case "Engine HP":
          vehicleData.EngineHP = value;
          break;
        case "Fuel Type - Primary":
          vehicleData.FuelTypePrimary = value;
          break;
        case "GVWR":
          vehicleData.GVWR = value;
          break;
        case "Drive Type":
          vehicleData.DriveType = value;
          break;
        case "Manufacturer Name":
          vehicleData.Manufacturer = value;
          break;
        case "Plant City":
          vehicleData.PlantCity = value;
          break;
        case "Plant Country":
          vehicleData.PlantCountry = value;
          break;
        case "Plant State":
          vehicleData.PlantState = value;
          break;
        case "Transmission Style":
          vehicleData.TransmissionStyle = value;
          break;
        case "Vehicle Type":
          vehicleData.VehicleType = value;
          break;
        case "Series":
          vehicleData.Series = value;
          break;
        case "Series2":
          vehicleData.Series2 = value;
          break;
      }
    }
  });

  return vehicleData;
};