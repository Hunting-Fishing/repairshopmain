
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PhoneNumberInput({
  value,
  onChange,
  error,
  className,
  ...props
}: PhoneNumberInputProps) {
  const formatPhoneNumber = (input: string): string => {
    const numbers = input.replace(/\D/g, "").slice(0, 10);
    if (numbers.length === 0) return "";
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  const isValid = (phone: string): boolean => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone) || phone === "";
  };

  return (
    <div className="space-y-1">
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        className={cn(
          "font-mono",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        placeholder="XXX-XXX-XXXX"
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {value && !isValid(value) && !error && (
        <p className="text-sm text-amber-500">
          Please enter a valid phone number (XXX-XXX-XXXX)
        </p>
      )}
    </div>
  );
}
