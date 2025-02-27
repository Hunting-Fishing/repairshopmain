
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddressTypeSelectorProps {
  value: "billing" | "shipping" | "other";
  onValueChange: (value: "billing" | "shipping" | "other") => void;
  disabled?: boolean;
}

export function AddressTypeSelector({
  value,
  onValueChange,
  disabled
}: AddressTypeSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="billing">Billing</SelectItem>
        <SelectItem value="shipping">Shipping</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  );
}
