
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessType } from "@/hooks/useBusinessTypes";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface BusinessInformationSectionProps {
  isLoadingTypes: boolean;
  businessTypes?: BusinessType[];
  selectedBusinessType: BusinessType | null;
  onBusinessTypeChange: (value: string) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function BusinessInformationSection({
  isLoadingTypes,
  businessTypes,
  selectedBusinessType,
  onBusinessTypeChange,
  register,
  errors,
}: BusinessInformationSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="organizationName">Business Information</Label>
      <Input
        {...register("organizationName", { required: "Business name is required" })}
        id="organizationName"
        placeholder="Business Name"
        aria-label="Business name"
      />
      {errors.organizationName && (
        <p className="text-sm text-red-500">{errors.organizationName.message as string}</p>
      )}

      <Input
        {...register("businessPhone", { required: "Business phone is required" })}
        id="businessPhone"
        placeholder="Business Phone"
        aria-label="Business phone number"
      />
      {errors.businessPhone && (
        <p className="text-sm text-red-500">{errors.businessPhone.message as string}</p>
      )}

      {isLoadingTypes ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedBusinessType?.id}
          onValueChange={onBusinessTypeChange}
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
