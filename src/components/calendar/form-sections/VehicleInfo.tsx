
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";
import { BasicVehicleInfo } from "./vehicle/BasicVehicleInfo";
import { JobDetails } from "./vehicle/JobDetails";

interface VehicleInfoProps {
  form: UseFormReturn<BookingFormValues>;
}

export function VehicleInfo({ form }: VehicleInfoProps) {
  return (
    <div className="space-y-6">
      <BasicVehicleInfo form={form} />
      <JobDetails form={form} />
    </div>
  );
}
