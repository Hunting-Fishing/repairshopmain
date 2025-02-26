
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { ValidationStatus } from "../../ValidationStatus";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";
import { useState } from "react";

type AllowedFields = {
  [K in keyof CustomerFormValues]: CustomerFormValues[K] extends string | undefined ? K : never;
}[keyof CustomerFormValues];

interface FormInputProps {
  form: UseFormReturn<CustomerFormValues>;
  name: AllowedFields;
  label: string;
  type?: string;
  placeholder?: string;
  isModernTheme?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

export function FormInput({
  form,
  name,
  label,
  type = "text",
  placeholder,
  isModernTheme = false,
  required = false,
  readOnly = false
}: FormInputProps) {
  const [shake, setShake] = useState(false);
  const error = form.formState.errors[name];
  const isTouched = form.formState.touchedFields[name];
  const value = form.getValues(name);
  const isEmpty = required && (!value || value.trim() === "");
  
  const inputClasses = cn(
    "transition-all duration-200",
    isModernTheme
      ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg"
      : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white",
    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    isEmpty && "border-red-500 bg-red-50/50",
    readOnly && "bg-gray-100 cursor-not-allowed",
    shake && "animate-shake"
  );

  const labelClasses = cn(
    isModernTheme
      ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
      : "text-gray-700 font-medium",
    error && "text-red-500",
    isEmpty && "text-red-500"
  );

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (required && !event.target.value) {
      setShake(true);
      setTimeout(() => setShake(false), 650);
    }
    form.register(name).onBlur(event);
  };

  const validation = (() => {
    if (!isTouched || !value) return null;

    if (type === "email") {
      return validateEmail(value);
    } else if (name === "phone_number") {
      return validatePhoneNumber(value);
    }
    return null;
  })();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            <span className="flex items-center gap-1">
              {label}
              {required && (
                <span 
                  className="text-red-500 text-sm font-bold ml-0.5" 
                  aria-label="required field"
                >*</span>
              )}
            </span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={required ? `${placeholder} *` : placeholder}
              className={inputClasses}
              aria-required={required}
              aria-invalid={!!error || isEmpty}
              readOnly={readOnly}
              onBlur={handleBlur}
            />
          </FormControl>
          {error && (
            <FormMessage className="text-red-500 text-sm font-medium animate-slideDown" />
          )}
          {isEmpty && !error && (
            <FormMessage className="text-red-500 text-sm font-medium animate-slideDown">
              {label} is required
            </FormMessage>
          )}
          {validation && (
            <ValidationStatus 
              status={validation.type || (validation.isValid ? 'success' : 'error')}
              type={type === "email" ? "Email" : "Phone"}
              message={validation.message || ''}
              details={validation.details}
            />
          )}
        </FormItem>
      )}
    />
  );
}
