
import { Switch } from "@/components/ui/switch";

interface ManualPriceToggleProps {
  useManualPrice: boolean;
  onToggle: (checked: boolean) => void;
}

export function ManualPriceToggle({ useManualPrice, onToggle }: ManualPriceToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Manual Price</span>
      <Switch
        checked={useManualPrice}
        onCheckedChange={onToggle}
      />
    </div>
  );
}
