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
      const key = result.Variable;
      
      // Map NHTSA fields to our vehicle info fields
      switch (key) {
        case "Make":
          vehicleInfo.Make = result.Value.trim();
          break;
        case "Model":
          vehicleInfo.Model = result.Value.trim();
          break;
        case "Trim":
          vehicleInfo.Trim = result.Value.trim();
          break;
        case "Vehicle Type":
          vehicleInfo.VehicleType = result.Value.trim();
          break;
        case "Engine Number of Cylinders":
          vehicleInfo["Engine Number of Cylinders"] = result.Value.trim();
          break;
        case "Displacement (L)":
          vehicleInfo["Displacement (L)"] = result.Value.trim();
          break;
        case "Fuel Type - Primary":
          vehicleInfo["Fuel Type - Primary"] = result.Value.trim();
          break;
        case "Other Engine Info":
          vehicleInfo["Other Engine Info"] = result.Value.trim();
          break;
        case "Body Class":
          vehicleInfo["Body Class"] = result.Value.trim();
          break;
        case "Drive Type":
          vehicleInfo["Drive Type"] = result.Value.trim();
          break;
        case "Gross Vehicle Weight Rating From":
          vehicleInfo["Gross Vehicle Weight Rating"] = result.Value.trim();
          break;
        case "Plant Country":
          vehicleInfo["Plant Country"] = result.Value.trim();
          break;
        case "Turbo":
          vehicleInfo.Turbo = result.Value.trim();
          break;
      }
    }
  });

  console.log("Processed Vehicle Info:", vehicleInfo);
  return vehicleInfo;
};