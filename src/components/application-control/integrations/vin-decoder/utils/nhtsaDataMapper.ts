import { VehicleInfo } from "../../NhtsaVinDialog";

export const mapNhtsaDataToVehicleInfo = (data: any[], vin: string): VehicleInfo => {
  const vehicleData: VehicleInfo = {
    Make: '',
    Model: '',
    ModelYear: '',
    "Manufacturer Name": '',
    "Plant City": '',
    "Plant Country": '',
    Trim: '',
    VehicleType: '',
    "Engine Number of Cylinders": '',
    "Displacement (L)": '',
    "Fuel Type - Primary": '',
    "Other Engine Info": '',
    Turbo: '',
    "Gross Vehicle Weight Rating From": '',
    "Body Class": '',
    "Drive Type": '',
    Series: '',
  };

  data.forEach((result) => {
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
        case "Manufacturer Name":
          vehicleData["Manufacturer Name"] = value;
          break;
        case "Plant City":
          vehicleData["Plant City"] = value;
          break;
        case "Plant Country":
          vehicleData["Plant Country"] = value;
          break;
        case "Trim":
          vehicleData.Trim = value;
          break;
        case "Vehicle Type":
          vehicleData.VehicleType = value;
          break;
        case "Engine Number of Cylinders":
          vehicleData["Engine Number of Cylinders"] = value;
          break;
        case "Displacement (CC)":
          const liters = (parseInt(value) / 1000).toFixed(1);
          vehicleData["Displacement (L)"] = liters;
          break;
        case "Displacement (L)":
          vehicleData["Displacement (L)"] = value;
          break;
        case "Fuel Type - Primary":
          vehicleData["Fuel Type - Primary"] = value;
          break;
        case "Engine Configuration":
        case "Engine Model":
        case "Engine Manufacturer":
          const currentInfo = vehicleData["Other Engine Info"] ? 
            vehicleData["Other Engine Info"] + ", " : "";
          vehicleData["Other Engine Info"] = currentInfo + 
            `${result.Variable}: ${value}`;
          break;
        case "Turbo":
          vehicleData.Turbo = value;
          break;
        case "Gross Vehicle Weight Rating From":
          vehicleData["Gross Vehicle Weight Rating From"] = value;
          break;
        case "Body Class":
          vehicleData["Body Class"] = value;
          break;
        case "Drive Type":
          vehicleData["Drive Type"] = value;
          break;
        case "Series":
          vehicleData.Series = value;
          break;
        default:
          console.log(`Unhandled field: ${result.Variable} = ${value}`);
      }
    }
  });

  // Add the VIN to the vehicle data
  vehicleData.VIN = vin;

  return vehicleData;
};