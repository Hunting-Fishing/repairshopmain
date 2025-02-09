
import { Switch } from "@/components/ui/switch";

interface ManualPriceToggleProps {
  useManualPrice: boolean;
  onToggle: (checked: boolean) => void;
}

export function ManualPriceToggle({ useManualPrice, onToggle }: ManualPriceToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="space-y-0.5">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Manual Price</span>
        <p className="text-xs text-gray-500 dark:text-gray-400">Toggle to manually set the price</p>
      </div>
      <Switch
        checked={useManualPrice}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  );
}
