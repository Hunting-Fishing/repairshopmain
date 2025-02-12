
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
      customer_type: "Personal",
      language_preference: "en",
      marketing_preferences: {
        email: false,
        sms: false,
        phone: false
      }
    },
  });

  return { form };
}
