
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { ValidationStatus } from "../../ValidationStatus";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define paths type for nested object access
type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

interface FormInputProps {
  form: UseFormReturn<CustomerFormValues>;
  name: Path<CustomerFormValues>;
  label: string;
  type?: string;
  placeholder?: string;
  isModernTheme?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export function FormInput({
  form,
  name,
  label,
  type = "text",
  placeholder,
  isModernTheme = false,
  required = false,
  readOnly = false,
  helpText,
  icon,
  onBlur
}: FormInputProps) {
  const [shake, setShake] = useState(false);
  const error = form.formState.errors[name as keyof CustomerFormValues];
  const isTouched = form.formState.touchedFields[name as keyof CustomerFormValues];
  const value = form.getValues(name);

  // Add detailed logging for input value changes
  useEffect(() => {
    console.log('Input value details:', {
      name,
      value,
      type: typeof value,
      formValue: form.getValues(name),
      isTouched,
      error
    });
  }, [value, name, isTouched, error]);

  const isEmpty = required && (!value || (typeof value === 'string' && value.trim() === ""));
  
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
    if (onBlur) {
      onBlur(event);
    }
  };

  const validation = (() => {
    if (!isTouched || !value) return null;

    if (type === "email") {
      return validateEmail(String(value));
    } else if (name === "phone_number") {
      return validatePhoneNumber(String(value));
    }
    return null;
  })();

  const stringValue = typeof value === 'string' ? value : '';

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <div className="flex items-center gap-2">
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
            {helpText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">{helpText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {icon}
                </div>
              )}
              <Input
                {...field}
                value={stringValue}
                type={type}
                placeholder={required ? `${placeholder} *` : placeholder}
                className={cn(inputClasses, icon && "pl-10")}
                aria-required={required}
                aria-invalid={!!error || isEmpty}
                readOnly={readOnly}
                onBlur={handleBlur}
              />
            </div>
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
