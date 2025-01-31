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

  const vehicleInfo: VehicleInfo = {
    Make: '',
    Model: '',
    ModelYear: '',
    Trim: '',
    VehicleType: '',
    "Engine Number of Cylinders": '',
    "Displacement (L)": '',
    "Fuel Type - Primary": '',
    "Other Engine Info": '',
    Turbo: '',
    "Body Class": '',
    "Drive Type": '',
    "Gross Vehicle Weight Rating": '',
    "Plant Country": '',
    VIN: vin
  };

  const fieldMappings: { [key: string]: keyof VehicleInfo } = {
    "Make": "Make",
    "Model": "Model",
    "Model Year": "ModelYear",
    "Trim": "Trim",
    "Vehicle Type": "VehicleType",
    "Engine Number of Cylinders": "Engine Number of Cylinders",
    "Displacement (L)": "Displacement (L)",
    "Fuel Type - Primary": "Fuel Type - Primary",
    "Other Engine Info": "Other Engine Info",
    "Turbo": "Turbo",
    "Body Class": "Body Class",
    "Drive Type": "Drive Type",
    "Gross Vehicle Weight Rating From": "Gross Vehicle Weight Rating",
    "Plant Country": "Plant Country"
  };

  data.Results.forEach((result: NhtsaResult) => {
    const mappedField = fieldMappings[result.Variable];
    if (mappedField && result.Value && result.Value !== "null" && result.Value !== "Not Applicable") {
      vehicleInfo[mappedField] = result.Value;
    }
  });

  return vehicleInfo;
};