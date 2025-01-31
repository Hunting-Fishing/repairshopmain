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

  // Initialize vehicleInfo with empty values
  const vehicleInfo: any = {
    VIN: vin
  };

  // Log the raw data for debugging
  console.log('Raw NHTSA Data:', data.Results);

  // Process all results and include any field that has a valid value
  data.Results.forEach((result: NhtsaResult) => {
    if (result.Value && 
        result.Value !== "null" && 
        result.Value !== "Not Applicable" &&
        result.Value.trim() !== "") {
      // Clean up the field name to use as a key
      const fieldName = result.Variable.trim();
      vehicleInfo[fieldName] = result.Value.trim();
      
      // Log each valid field for debugging
      console.log(`Found valid field - ${fieldName}:`, result.Value);
    }
  });

  // Log the final mapped vehicle info
  console.log('Complete Vehicle Info:', vehicleInfo);

  return vehicleInfo;
};