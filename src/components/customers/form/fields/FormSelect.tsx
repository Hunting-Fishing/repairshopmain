
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerFormValues } from "../../types/customerTypes";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: keyof CustomerFormValues;
  label: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  name,
  label,
  options,
  required = false,
  placeholder = "Select an option",
  className,
}: FormSelectProps) {
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
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
