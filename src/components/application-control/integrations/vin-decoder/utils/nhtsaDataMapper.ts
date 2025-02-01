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

  data.Results.forEach((result: NhtsaResult) => {
    if (result.Value && result.Value !== "Not Applicable" && result.Value.trim() !== "") {
      if (result.Variable === "Model Year") {
        vehicleInfo.ModelYear = result.Value.trim();
        console.log("Found Model Year:", result.Value.trim());
      } else {
        const key = result.Variable as keyof VehicleInfo;
        if (key in vehicleInfo) {
          vehicleInfo[key] = result.Value.trim();
        }
      }
    }
  });

  console.log("Processed Vehicle Info:", vehicleInfo);
  return vehicleInfo;
};