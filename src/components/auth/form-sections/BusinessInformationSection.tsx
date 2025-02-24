
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessType } from "@/hooks/useBusinessTypes";

interface BusinessInformationSectionProps {
  isLoadingTypes: boolean;
  businessTypes?: BusinessType[];
  selectedBusinessType: BusinessType | null;
  onBusinessTypeChange: (value: string) => void;
}

export function BusinessInformationSection({
  isLoadingTypes,
  businessTypes,
  selectedBusinessType,
  onBusinessTypeChange,
}: BusinessInformationSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="organizationName">Business Information</Label>
      <Input
        id="organizationName"
        name="organizationName"
        placeholder="Business Name"
        required
        aria-label="Business name"
      />
      <Input
        id="businessPhone"
        name="businessPhone"
        placeholder="Business Phone"
        required
        aria-label="Business phone number"
      />
      {isLoadingTypes ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedBusinessType?.id}
          onValueChange={onBusinessTypeChange}
          required
        >
          <SelectTrigger aria-label="Select business type">
            <SelectValue placeholder="Select Business Type">
              {selectedBusinessType?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {businessTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
