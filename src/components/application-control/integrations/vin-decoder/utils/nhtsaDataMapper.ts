import { NhtsaResponse, NhtsaResult } from "../types";

export const mapNhtsaDataToVehicleInfo = (data: NhtsaResponse) => {
  const vehicleInfo: any = {
    VIN: "",
    Make: "",
    Model: "",
    ModelYear: "",
    Trim: "",
    "Body Class": "",
    "Engine Number of Cylinders": "",
    "Displacement (L)": "",
    "Fuel Type - Primary": "",
    "Other Engine Info": "",
    "Drive Type": "",
    "Gross Vehicle Weight Rating": "",
    "Plant Country": "",
    "Vehicle Type": "",
    "Manufacturer Name": "",
    "Turbo": "",
  };

  // First pass: get the VIN
  data.Results.forEach((result: NhtsaResult) => {
    if (result.Variable === "VIN" && result.Value) {
      vehicleInfo.VIN = result.Value.trim();
    }
  });

  // Second pass: map all other fields
  data.Results.forEach((result: NhtsaResult) => {
    if (!result.Value || result.Value === "Not Applicable" || result.Value.trim() === "") {
      return;
    }

    const value = result.Value.trim();
    
    switch (result.Variable) {
      case "Model Year":
        vehicleInfo.ModelYear = value;
        break;
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

  return vehicleInfo;
};