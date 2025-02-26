
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BusinessType } from "@/hooks/useBusinessTypes";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useState } from "react";

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
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleRetry = () => {
    setLoadError(null);
    // Trigger business types refetch here if needed
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="organizationName">Business Information</Label>
      
      <div className="space-y-2">
        <Input
          {...register("organizationName", { 
            required: "Business name is required",
            minLength: { value: 2, message: "Business name must be at least 2 characters" }
          })}
          id="organizationName"
          placeholder="Business Name"
          aria-label="Business name"
          aria-invalid={errors.organizationName ? "true" : "false"}
          className={errors.organizationName ? "border-red-500" : ""}
        />
        {errors.organizationName && (
          <p className="text-sm text-red-500" role="alert">
            {errors.organizationName.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register("businessPhone", { 
            required: "Business phone is required",
            pattern: {
              value: /^\+?[\d\s-]{10,}$/,
              message: "Please enter a valid phone number"
            }
          })}
          id="businessPhone"
          placeholder="Business Phone"
          aria-label="Business phone number"
          aria-invalid={errors.businessPhone ? "true" : "false"}
          className={errors.businessPhone ? "border-red-500" : ""}
        />
        {errors.businessPhone && (
          <p className="text-sm text-red-500" role="alert">
            {errors.businessPhone.message as string}
          </p>
        )}
      </div>

      {isLoadingTypes ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <p className="text-sm text-muted-foreground">Loading business types...</p>
        </div>
      ) : loadError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {loadError}
            <button
              onClick={handleRetry}
              className="text-sm underline hover:text-red-400"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          <Select 
            value={selectedBusinessType?.id}
            onValueChange={onBusinessTypeChange}
          >
            <SelectTrigger 
              aria-label="Select business type"
              className={!selectedBusinessType ? "text-muted-foreground" : ""}
            >
              <SelectValue placeholder="Select Business Type">
                {selectedBusinessType?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {businessTypes?.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.id}
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && (
            <p className="text-sm text-red-500" role="alert">
              {errors.businessType.message as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
