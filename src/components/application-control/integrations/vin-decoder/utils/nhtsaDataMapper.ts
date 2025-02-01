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

  // First pass: find the Model Year specifically
  const modelYearResult = data.Results.find(
    result => result.Variable === "Model Year" && result.Value
  );

  if (modelYearResult?.Value) {
    vehicleInfo.ModelYear = modelYearResult.Value.trim();
    console.log("Found Model Year:", modelYearResult.Value.trim());
  }

  // Second pass: map all other fields
  data.Results.forEach((result: NhtsaResult) => {
    if (result.Value && result.Value !== "Not Applicable" && result.Value.trim() !== "") {
      const key = result.Variable as keyof VehicleInfo;
      if (key in vehicleInfo && key !== "Model Year") { // Skip Model Year as it's already handled
        vehicleInfo[key] = result.Value.trim();
      }
    }
  });

  console.log("Processed Vehicle Info:", vehicleInfo);
  return vehicleInfo;
};