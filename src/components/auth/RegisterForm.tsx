
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
import { toast } from "sonner";

interface PasswordError {
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
  isLongEnough: boolean;
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordError>({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });

  const { signUp } = useAuth();
  const { countries, regions } = useLocationData(selectedCountry);
  const { businessTypes, isLoading: isLoadingTypes } = useBusinessTypes();

  const validatePassword = (value: string) => {
    setPasswordErrors({
      hasNumber: /\d/.test(value),
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      isLongEnough: value.length >= 8,
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordErrors).every(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const signUpData = {
      email: formData.get("email") as string,
      password: password,
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
          aria-label="Business name"
        />
        <Input
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
            onValueChange={(value) => {
              const selected = businessTypes?.find(type => type.id === value);
              setSelectedBusinessType(selected || null);
            }}
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
      <div className="space-y-2">
        <Label>Personal Information</Label>
        <Input
          name="firstName"
          placeholder="First Name"
          required
          aria-label="First name"
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          required
          aria-label="Last name"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          aria-label="Email address"
        />
        <div className="space-y-2">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
            aria-label="Password"
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm password"
          />
          <div className="text-sm space-y-1">
            <p className={passwordErrors.isLongEnough ? "text-green-600" : "text-red-600"}>
              ✓ At least 8 characters
            </p>
            <p className={passwordErrors.hasUpperCase ? "text-green-600" : "text-red-600"}>
              ✓ One uppercase letter
            </p>
            <p className={passwordErrors.hasLowerCase ? "text-green-600" : "text-red-600"}>
              ✓ One lowercase letter
            </p>
            <p className={passwordErrors.hasNumber ? "text-green-600" : "text-red-600"}>
              ✓ One number
            </p>
            <p className={passwordErrors.hasSpecialChar ? "text-green-600" : "text-red-600"}>
              ✓ One special character
            </p>
          </div>
        </div>
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          required
          aria-label="Phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="streetAddress"
          placeholder="Street Address"
          required
          aria-label="Street address"
        />
        <Input
          name="city"
          placeholder="City"
          required
          aria-label="City"
        />
        <Select 
          name="country" 
          required
          onValueChange={(value) => setSelectedCountry(value)}
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
          name="postalCode"
          placeholder="Postal Code"
          required
          aria-label="Postal code"
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
