
import { useForm } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";

export function useCustomerFormData({ initialData }: { initialData?: any }) {
  const form = useForm<CustomerFormValues>({
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      street_address: "",
      city: "",
      state_province: "",
      postal_code: "",
      country: "",
      notes: "",
      vehicle_make: "",
      vehicle_model: "",
      vehicle_year: "",
      customer_type: "Personal",
    },
  });

  return { form };
}
