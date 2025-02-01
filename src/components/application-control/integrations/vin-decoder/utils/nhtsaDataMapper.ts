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
    console.log("Found Model Year:", vehicleInfo.ModelYear);
  }

  // Second pass: map all other fields
  data.Results.forEach((result: NhtsaResult) => {
    if (!result.Value || result.Value === "Not Applicable" || result.Value.trim() === "") {
      return;
    }

    const value = result.Value.trim();
    
    switch (result.Variable) {
      case "Make":
        vehicleInfo.Make = value;
        break;
      case "Model":
        vehicleInfo.Model = value;
        break;
      case "Trim":
        vehicleInfo.Trim = value;
        break;
      case "Vehicle Type":
        vehicleInfo.VehicleType = value;
        break;
      case "Engine Number of Cylinders":
        vehicleInfo["Engine Number of Cylinders"] = value;
        break;
      case "Displacement (L)":
        vehicleInfo["Displacement (L)"] = value;
        break;
      case "Fuel Type - Primary":
        vehicleInfo["Fuel Type - Primary"] = value;
        break;
      case "Other Engine Info":
        vehicleInfo["Other Engine Info"] = value;
        break;
      case "Body Class":
        vehicleInfo["Body Class"] = value;
        break;
      case "Drive Type":
        vehicleInfo["Drive Type"] = value;
        break;
      case "Gross Vehicle Weight Rating From":
        vehicleInfo["Gross Vehicle Weight Rating"] = value;
        break;
      case "Plant Country":
        vehicleInfo["Plant Country"] = value;
        break;
      case "Turbo":
        vehicleInfo.Turbo = value;
        break;
    }
  });

  console.log("Processed Vehicle Info:", vehicleInfo);
  return vehicleInfo;
};