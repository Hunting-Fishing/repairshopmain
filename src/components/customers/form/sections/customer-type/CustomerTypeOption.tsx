
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CustomerTypeOption } from "./options";

interface CustomerTypeOptionProps {
  option: CustomerTypeOption;
  isSelected: boolean;
  isModernTheme: boolean;
}

export function CustomerTypeOptionItem({ option, isSelected, isModernTheme }: CustomerTypeOptionProps) {
  const Icon = option.icon;
  
  return (
    <FormItem
      className={cn(
        "flex items-center space-x-3 space-y-0 rounded-lg border p-4",
        "transition-all duration-200",
        isSelected
          ? isModernTheme
            ? "border-orange-500 bg-orange-50/50"
            : "border-orange-200 bg-orange-50/30"
          : "hover:border-gray-300"
      )}
    >
      <FormControl>
        <RadioGroupItem value={option.value} />
      </FormControl>
      <div className="flex-1 space-y-1">
        <FormLabel className="flex items-center gap-2">
          <Icon 
            className={cn(
              "h-4 w-4",
              isSelected ? "text-orange-500" : "text-gray-500"
            )} 
          />
          <span className={cn(
            "font-medium",
            isSelected ? "text-orange-900" : "text-gray-900"
          )}>
            {option.label}
          </span>
        </FormLabel>
        {option.description && (
          <p className={cn(
            "text-sm",
            isSelected ? "text-orange-700" : "text-gray-500"
          )}>
            {option.description}
          </p>
        )}
      </div>
    </FormItem>
  );
}
