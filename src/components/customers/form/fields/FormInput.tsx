
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerFormValues } from "../../types/customerTypes";

interface FormInputProps {
  name: keyof CustomerFormValues;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function FormInput({
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  className,
}: FormInputProps) {
  const { control } = useFormContext<CustomerFormValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input 
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
