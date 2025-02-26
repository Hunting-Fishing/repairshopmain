
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useState } from "react";

interface Country {
  id: string;
  name: string;
}

interface Region {
  id: string;
  name: string;
}

interface AddressSectionProps {
  countries?: Country[];
  regions?: Region[];
  onCountryChange: (value: string) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isLoading?: boolean;
}

export function AddressSection({
  countries,
  regions,
  onCountryChange,
  register,
  errors,
  isLoading = false
}: AddressSectionProps) {
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleRetry = () => {
    setLocationError(null);
    // Trigger data refetch here if needed
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>Address</Label>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="streetAddress">Address</Label>

      <div className="space-y-2">
        <Input
          {...register("streetAddress", { 
            required: "Street address is required",
            minLength: { value: 5, message: "Please enter a valid street address" }
          })}
          id="streetAddress"
          placeholder="Street Address"
          aria-label="Street address"
          aria-invalid={errors.streetAddress ? "true" : "false"}
          className={errors.streetAddress ? "border-red-500" : ""}
        />
        {errors.streetAddress && (
          <p className="text-sm text-red-500" role="alert">
            {errors.streetAddress.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register("city", { 
            required: "City is required",
            minLength: { value: 2, message: "Please enter a valid city name" }
          })}
          id="city"
          placeholder="City"
          aria-label="City"
          aria-invalid={errors.city ? "true" : "false"}
          className={errors.city ? "border-red-500" : ""}
        />
        {errors.city && (
          <p className="text-sm text-red-500" role="alert">
            {errors.city.message as string}
          </p>
        )}
      </div>

      {locationError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {locationError}
            <button
              onClick={handleRetry}
              className="text-sm underline hover:text-red-400"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="space-y-2">
            <Select 
              {...register("country", { required: "Country is required" })}
              onValueChange={onCountryChange}
            >
              <SelectTrigger 
                aria-label="Select country"
                className={errors.country ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500" role="alert">
                {errors.country.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Select 
              {...register("stateProvince", { required: "State/Province is required" })}
            >
              <SelectTrigger 
                aria-label="Select state or province"
                className={errors.stateProvince ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select State/Province" />
              </SelectTrigger>
              <SelectContent>
                {regions?.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stateProvince && (
              <p className="text-sm text-red-500" role="alert">
                {errors.stateProvince.message as string}
              </p>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Input
          {...register("postalCode", { 
            required: "Postal code is required",
            pattern: {
              value: /^[A-Za-z0-9\s-]{3,10}$/,
              message: "Please enter a valid postal code"
            }
          })}
          id="postalCode"
          placeholder="Postal Code"
          aria-label="Postal code"
          aria-invalid={errors.postalCode ? "true" : "false"}
          className={errors.postalCode ? "border-red-500" : ""}
        />
        {errors.postalCode && (
          <p className="text-sm text-red-500" role="alert">
            {errors.postalCode.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
