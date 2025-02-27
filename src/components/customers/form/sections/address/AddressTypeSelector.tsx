
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Briefcase, GripVertical } from "lucide-react";

interface AddressTypeSelectorProps {
  type: string;
  onChange: (type: 'home' | 'work' | 'other') => void;
}

const ADDRESS_TYPES = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'other', label: 'Other', icon: GripVertical }
] as const;

export function AddressTypeSelector({ type, onChange }: AddressTypeSelectorProps) {
  return (
    <Select
      value={type}
      onValueChange={(value: 'home' | 'work' | 'other') => onChange(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ADDRESS_TYPES.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
