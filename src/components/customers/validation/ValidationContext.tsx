
import { createContext, useContext, ReactNode } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { CustomerFormValues, CustomerType } from "../types/customerTypes";
import { ValidationResult } from "../hooks/useCustomerValidation";

interface ValidationContextType {
  validateField: (name: keyof CustomerFormValues, value: any) => ValidationResult;
  validateForm: (data: CustomerFormValues) => ValidationResult;
  clearErrors: () => void;
  updateCustomerType: (type: CustomerType) => void;
  validationErrors: Record<string, string>;
  customerType: CustomerType;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export function ValidationProvider({ children, initialCustomerType = 'Personal' }: { 
  children: ReactNode;
  initialCustomerType?: CustomerType;
}) {
  const validation = useFormValidation({ initialCustomerType });
  
  return (
    <ValidationContext.Provider value={validation}>
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
}
