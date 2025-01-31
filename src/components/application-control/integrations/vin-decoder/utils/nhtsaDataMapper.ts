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

  // Create a map for direct field mappings
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

  // Log the raw data for debugging
  console.log('Raw NHTSA Data:', data.Results);

  data.Results.forEach((result: NhtsaResult) => {
    const mappedField = fieldMappings[result.Variable];
    if (mappedField && result.Value && result.Value !== "null" && result.Value !== "Not Applicable") {
      vehicleInfo[mappedField] = result.Value;
      // Log each mapped field for debugging
      console.log(`Mapping ${result.Variable} to ${mappedField}:`, result.Value);
    }
  });

  // Log the final mapped vehicle info
  console.log('Mapped Vehicle Info:', vehicleInfo);

  return vehicleInfo;
};