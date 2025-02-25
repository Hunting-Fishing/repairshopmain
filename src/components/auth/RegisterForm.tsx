
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLocationData } from "@/hooks/useLocationData";
import { useBusinessTypes, BusinessType } from "@/hooks/useBusinessTypes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { validatePassword, isPasswordValid } from "@/utils/auth/passwordValidation";
import { useAuthRateLimit } from "@/hooks/useAuthRateLimit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessInformationSection } from "./form-sections/BusinessInformationSection";
import { PersonalInformationSection } from "./form-sections/PersonalInformationSection";
import { AddressSection } from "./form-sections/AddressSection";

const ROLES = ['admin', 'moderator', 'user'] as const;
type UserRole = typeof ROLES[number];

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
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

  const handleBusinessTypeChange = (value: string) => {
    const selected = businessTypes?.find(type => type.id === value);
    setSelectedBusinessType(selected || null);
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
    const email = formData.get("email") as string;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const signUpData = {
      email,
      password,
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
      role,
    };

    try {
      await signUp(signUpData);
      formRef.current?.reset();
      setPassword("");
      setConfirmPassword("");
      setSelectedBusinessType(null);
      setSelectedCountry("");
      setRole("user");
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
      <BusinessInformationSection
        isLoadingTypes={isLoadingTypes}
        businessTypes={businessTypes}
        selectedBusinessType={selectedBusinessType}
        onBusinessTypeChange={handleBusinessTypeChange}
      />

      <PersonalInformationSection
        password={password}
        confirmPassword={confirmPassword}
        passwordErrors={passwordErrors}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      />

      <AddressSection
        countries={countries}
        regions={regions}
        onCountryChange={setSelectedCountry}
      />

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
