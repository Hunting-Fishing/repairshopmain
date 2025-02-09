
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  value?: number | string | RegExp;
  validator?: (value: any) => boolean;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    [key: string]: string[];
  };
}

export interface FormValidation<T> {
  validate: (data: T) => ValidationResult;
  validateField: (field: keyof T, value: any) => string[];
  getFieldErrors: (field: keyof T) => string[];
  clearErrors: () => void;
}
