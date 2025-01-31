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
    "Manufacturer Name": '',
    "Plant City": '',
    "Plant State": '',
    "Plant Country": '',
    Trim: '',
    VehicleType: '',
    Series: '',
    Series2: '',
    "Engine Number of Cylinders": '',
    "Displacement (L)": '',
    "Fuel Type - Primary": '',
    "Other Engine Info": '',
    Turbo: '',
    "Gross Vehicle Weight Rating From": '',
    "Body Class": '',
    "Drive Type": '',
    VIN: vin
  };

  data.Results.forEach((result: NhtsaResult) => {
    const value = result.Value;
    if (value && value !== "null" && value !== "Not Applicable") {
      switch (result.Variable) {
        case "Make":
          vehicleInfo.Make = value;
          break;
        case "Model":
          vehicleInfo.Model = value;
          break;
        case "Model Year":
          vehicleInfo.ModelYear = value;
          break;
        case "Manufacturer Name":
          vehicleInfo["Manufacturer Name"] = value;
          break;
        case "Plant City":
          vehicleInfo["Plant City"] = value;
          break;
        case "Plant State":
          vehicleInfo["Plant State"] = value;
          break;
        case "Plant Country":
          vehicleInfo["Plant Country"] = value;
          break;
        case "Trim":
          vehicleInfo.Trim = value;
          break;
        case "Body Class":
          vehicleInfo["Body Class"] = value;
          break;
        case "Displacement (L)":
          vehicleInfo["Displacement (L)"] = value;
          break;
        case "Engine Number of Cylinders":
          vehicleInfo["Engine Number of Cylinders"] = value;
          break;
        case "Fuel Type - Primary":
          vehicleInfo["Fuel Type - Primary"] = value;
          break;
        case "Other Engine Info":
          vehicleInfo["Other Engine Info"] = value;
          break;
        case "Turbo":
          vehicleInfo.Turbo = value;
          break;
        case "Gross Vehicle Weight Rating From":
          vehicleInfo["Gross Vehicle Weight Rating From"] = value;
          break;
        case "Drive Type":
          vehicleInfo["Drive Type"] = value;
          break;
        case "Vehicle Type":
          vehicleInfo.VehicleType = value;
          break;
        case "Series":
          vehicleInfo.Series = value;
          break;
        case "Series2":
          vehicleInfo.Series2 = value;
          break;
      }
    }
  });

  return vehicleInfo;
};