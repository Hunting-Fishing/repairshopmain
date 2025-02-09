
export type ValidationType = 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom' | 
                           'minLength' | 'maxLength' | 'number' | 'date' | 'phone' | 'url';

export interface ValidationRule {
  type: ValidationType;
  message: string;
  value?: number | string | RegExp | Date;
  validator?: (value: any) => boolean | Promise<boolean>;
  options?: {
    allowEmpty?: boolean;
    trim?: boolean;
    caseSensitive?: boolean;
    customPattern?: RegExp;
  };
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationError {
  field: string;
  message: string;
  type: ValidationType;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    [key: string]: string[];
  };
  errorList: ValidationError[];
}

export interface FormValidation<T> {
  validate: (data: T) => Promise<ValidationResult>;
  validateField: (field: keyof T, value: any) => Promise<string[]>;
  getFieldErrors: (field: keyof T) => string[];
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  resetValidation: () => void;
  touchField: (field: keyof T) => void;
  isDirty: (field?: keyof T) => boolean;
  isFieldTouched: (field: keyof T) => boolean;
}

export interface AsyncValidationOptions {
  debounceMs?: number;
  abortPrevious?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnSubmit?: boolean;
}
