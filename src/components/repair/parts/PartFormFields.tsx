
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PartFormFieldsProps {
  selectedPart: string;
  quantity: string;
  onPartChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  inventoryItems: Array<{
    id: string;
    name: string;
    sku: string;
  }> | undefined;
}

export function PartFormFields({
  selectedPart,
  quantity,
  onPartChange,
  onQuantityChange,
  inventoryItems
}: PartFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="part">Select Part</Label>
        <select
          id="part"
          value={selectedPart}
          onChange={(e) => onPartChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="">Select a part...</option>
          {inventoryItems?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku})
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
        />
      </div>
    </div>
  );
}
