import { NhtsaResponse, NhtsaResult } from "../types";
import { VehicleInfo } from "../../NhtsaVinDialog";

export const mapNhtsaDataToVehicleInfo = (data: NhtsaResponse): VehicleInfo => {
  const vehicleInfo: VehicleInfo = {
    VIN: "",
    Make: "",
    Model: "",
    ModelYear: "",
    ProductionDate: "",
    Trim: "",
    VehicleType: "",
    "Engine Number of Cylinders": "",
    "Displacement (L)": "",
    "Fuel Type - Primary": "",
    "Other Engine Info": "",
    Turbo: "",
    "Body Class": "",
    "Drive Type": "",
    "Gross Vehicle Weight Rating": "",
    "Plant Country": ""
  };

  // Map all fields
  data.Results.forEach((result: NhtsaResult) => {
    if (!result.Value || result.Value === "Not Applicable" || result.Value.trim() === "") {
      return;
    }

    const value = result.Value.trim();
    
    switch (result.Variable) {
      case "VIN":
        vehicleInfo.VIN = value;
        break;
      case "Model Year":
        vehicleInfo.ModelYear = value;
        break;
      case "Production Date":
        vehicleInfo.ProductionDate = value;
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

  console.log("Mapped Vehicle Info:", vehicleInfo);
  return vehicleInfo;
};