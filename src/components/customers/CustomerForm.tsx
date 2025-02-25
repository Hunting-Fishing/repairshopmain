
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormContainer } from "./form/CustomerFormContainer";
import { CustomerFormValues } from "./types/customerTypes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { customerFormSchema } from "./schemas/customerFormSchema";
import { useCustomerSubmit } from "./hooks/useCustomerSubmit";

export interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: CustomerFormValues;
  mode?: "create" | "edit";
}

export function CustomerForm({ onSuccess, initialData, mode = "create" }: CustomerFormProps) {
  const { handleSubmit, isSubmitting } = useCustomerSubmit({
    mode,
    initialData,
    onSuccess
  });
  
  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
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
    mode: "onChange",
    criteriaMode: "all"
  });

  if (mode === "edit" && !initialData?.id) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load customer data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <CustomerFormContainer 
        onSubmit={methods.handleSubmit(handleSubmit)}
        mode={mode}
        isSubmitting={isSubmitting}
      />
    </FormProvider>
  );
}
