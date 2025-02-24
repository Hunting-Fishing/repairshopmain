import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationData } from "@/hooks/useLocationData";
import { useBusinessTypes, BusinessType } from "@/hooks/useBusinessTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const { signUp } = useAuth();
  const { countries, regions } = useLocationData(selectedCountry);
  const { businessTypes, isLoading: isLoadingTypes } = useBusinessTypes();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const signUpData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      organizationName: formData.get("organizationName") as string,
      businessPhone: formData.get("businessPhone") as string,
      businessType: selectedBusinessType?.id,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      streetAddress: formData.get("streetAddress") as string,
      city: formData.get("city") as string,
      stateProvince: formData.get("stateProvince") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
    };

    try {
      await signUp(signUpData);
    } catch (error) {
      // Error is handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label>Business Information</Label>
        <Input
          name="organizationName"
          placeholder="Business Name"
          required
        />
        <Input
          name="businessPhone"
          placeholder="Business Phone"
          required
        />
        {isLoadingTypes ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedBusinessType?.id}
            onValueChange={(value) => {
              const selected = businessTypes?.find(type => type.id === value);
              setSelectedBusinessType(selected || null);
            }}
            required
          >
            <SelectTrigger>
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
      <div className="space-y-2">
        <Label>Personal Information</Label>
        <Input
          name="firstName"
          placeholder="First Name"
          required
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="streetAddress"
          placeholder="Street Address"
          required
        />
        <Input
          name="city"
          placeholder="City"
          required
        />
        <Select 
          name="country" 
          required
          onValueChange={(value) => setSelectedCountry(value)}
        >
          <SelectTrigger>
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
          <SelectTrigger>
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
          name="postalCode"
          placeholder="Postal Code"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner className="mr-2" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
