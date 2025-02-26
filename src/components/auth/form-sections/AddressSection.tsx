
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, FieldErrors } from "react-hook-form";

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
}

export function AddressSection({
  countries,
  regions,
  onCountryChange,
  register,
  errors
}: AddressSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="streetAddress">Address</Label>
      <Input
        {...register("streetAddress", { required: "Street address is required" })}
        id="streetAddress"
        placeholder="Street Address"
        aria-label="Street address"
      />
      {errors.streetAddress && (
        <p className="text-sm text-red-500">{errors.streetAddress.message as string}</p>
      )}

      <Input
        {...register("city", { required: "City is required" })}
        id="city"
        placeholder="City"
        aria-label="City"
      />
      {errors.city && (
        <p className="text-sm text-red-500">{errors.city.message as string}</p>
      )}

      <Select 
        {...register("country")}
        onValueChange={onCountryChange}
      >
        <SelectTrigger aria-label="Select country">
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
        <p className="text-sm text-red-500">{errors.country.message as string}</p>
      )}

      <Select {...register("stateProvince")}>
        <SelectTrigger aria-label="Select state or province">
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
        <p className="text-sm text-red-500">{errors.stateProvince.message as string}</p>
      )}

      <Input
        {...register("postalCode", { required: "Postal code is required" })}
        id="postalCode"
        placeholder="Postal Code"
        aria-label="Postal code"
      />
      {errors.postalCode && (
        <p className="text-sm text-red-500">{errors.postalCode.message as string}</p>
      )}
    </div>
  );
}
