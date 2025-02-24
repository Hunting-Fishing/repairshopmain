
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

export function AddressSection({
  countries,
  regions,
  onCountryChange,
}: AddressSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="streetAddress">Address</Label>
      <Input
        id="streetAddress"
        name="streetAddress"
        placeholder="Street Address"
        required
        aria-label="Street address"
      />
      <Input
        id="city"
        name="city"
        placeholder="City"
        required
        aria-label="City"
      />
      <Select 
        name="country" 
        required
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
      <Select name="stateProvince" required>
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
      <Input
        id="postalCode"
        name="postalCode"
        placeholder="Postal Code"
        required
        aria-label="Postal code"
      />
    </div>
  );
}
