
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { AdditionalDetailsSection } from "../sections/AdditionalDetailsSection";

interface CustomerTypeContentProps {
  form: UseFormReturn<CustomerFormValues>;
  customerType: string | undefined;
  isModernTheme?: boolean;
}

export function CustomerTypeContent({ form, customerType, isModernTheme }: CustomerTypeContentProps) {
  if (!customerType) return null;

  const requiredFields: string[] = [];

  return (
    <>
      {(customerType === "Fleet" || customerType === "Business") && (
        <AdditionalDetailsSection 
          form={form} 
          isModernTheme={isModernTheme} 
          requiredFields={requiredFields}
        />
      )}
    </>
  );
}
