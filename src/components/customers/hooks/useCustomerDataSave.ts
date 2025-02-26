
import { CustomerFormValues } from "../types/customerTypes";
import { useCustomerMutation } from "./useCustomerMutation";
import { useCustomerValidation } from "./useCustomerValidation";
import { useCustomerEnrichment } from "./useCustomerEnrichment";
import { useProfileCompleteness } from "./useProfileCompleteness";

export function useCustomerDataSave(customerId: string) {
  const { updateField, updateMultipleFields, isSaving } = useCustomerMutation(customerId);
  const { validateCustomerData } = useCustomerValidation();
  const { enrichCustomerData } = useCustomerEnrichment();
  const { calculateProfileCompleteness } = useProfileCompleteness();

  return {
    isSaving,
    updateField,
    updateMultipleFields,
    calculateProfileCompleteness,
    enrichCustomerData,
    validateCustomerData
  };
}
