
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocationData } from "@/hooks/useLocationData";
import { useBusinessTypes, BusinessType } from "@/hooks/useBusinessTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { validatePassword, isPasswordValid } from "@/utils/auth/passwordValidation";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { useAuthRateLimit } from "@/hooks/useAuthRateLimit";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { signUp } = useAuth();
  const { countries, regions } = useLocationData(selectedCountry);
  const { businessTypes, isLoading: isLoadingTypes } = useBusinessTypes();
  const { isRateLimited, checkRateLimit } = useAuthRateLimit();

  const [passwordErrors, setPasswordErrors] = useState(validatePassword(""));

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid(passwordErrors)) {
      toast.error("Password does not meet requirements");
      return;
    }

    // Check rate limit before proceeding
    const clientIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip);
    
    const canProceed = await checkRateLimit(clientIp);
    if (!canProceed) {
      toast.error("Too many attempts. Please try again later.");
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
      formRef.current?.reset();
      setPassword("");
      setConfirmPassword("");
      setSelectedBusinessType(null);
      setSelectedCountry("");
    } catch (error) {
      // Error is handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  if (isRateLimited) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Temporarily Blocked</AlertTitle>
        <AlertDescription>
          Too many attempts. Please try again in a few minutes.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSignUp} ref={formRef} className="space-y-4">
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
        <Label htmlFor="firstName">Personal Information</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="First Name"
          required
          aria-label="First name"
        />
        <Input
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          required
          aria-label="Last name"
        />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          aria-label="Email address"
        />
        <div className="space-y-2">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
            aria-label="Password"
            aria-describedby="password-requirements"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm password"
          />
          <div id="password-requirements">
            <PasswordStrengthIndicator errors={passwordErrors} />
          </div>
        </div>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Phone Number"
          required
          aria-label="Phone number"
        />
      </div>

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
          id="postalCode"
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
