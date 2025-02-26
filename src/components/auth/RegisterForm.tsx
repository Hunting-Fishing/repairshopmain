
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationData } from "@/hooks/useLocationData";
import { useBusinessTypes, BusinessType } from "@/hooks/useBusinessTypes";
import { toast } from "sonner";
import { validatePassword, isPasswordValid } from "@/utils/auth/passwordValidation";
import { useAuthRateLimit } from "@/hooks/useAuthRateLimit";
import { BusinessInformationSection } from "./form-sections/BusinessInformationSection";
import { PersonalInformationSection } from "./form-sections/PersonalInformationSection";
import { AddressSection } from "./form-sections/AddressSection";
import { RoleSelector, UserRole } from "./form-sections/RoleSelector";
import { SubmitButton } from "./form-sections/SubmitButton";
import { RateLimitAlert } from "./form-sections/RateLimitAlert";
import { useForm } from "react-hook-form";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  businessPhone: string;
  businessType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  role: UserRole;
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [passwordErrors, setPasswordErrors] = useState(validatePassword(""));

  const { signUp } = useAuth();
  const { countries, regions } = useLocationData(selectedCountry);
  const { businessTypes, isLoading: isLoadingTypes } = useBusinessTypes();
  const { isRateLimited, checkRateLimit } = useAuthRateLimit();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      businessPhone: "",
      businessType: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      role: "user"
    },
    mode: "onBlur"
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const password = watch("password");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("password", value);
    setPasswordErrors(validatePassword(value));
  };

  const handleBusinessTypeChange = (value: string) => {
    const selected = businessTypes?.find(type => type.id === value);
    setSelectedBusinessType(selected || null);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid(passwordErrors)) {
      toast.error("Password does not meet requirements");
      return;
    }

    const clientIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip);
    
    const canProceed = await checkRateLimit(clientIp);
    if (!canProceed) {
      toast.error("Too many attempts. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        ...data,
        businessType: selectedBusinessType?.id,
      });
      form.reset();
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
    return <RateLimitAlert />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <BusinessInformationSection
        isLoadingTypes={isLoadingTypes}
        businessTypes={businessTypes}
        selectedBusinessType={selectedBusinessType}
        onBusinessTypeChange={handleBusinessTypeChange}
        register={register}
        errors={errors}
      />

      <PersonalInformationSection
        register={register}
        errors={errors}
        password={password}
        confirmPassword={watch("confirmPassword")}
        passwordErrors={passwordErrors}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={(e) => setValue("confirmPassword", e.target.value)}
      />

      <AddressSection
        countries={countries}
        regions={regions}
        onCountryChange={setSelectedCountry}
        register={register}
        errors={errors}
      />

      <RoleSelector 
        role={role} 
        onRoleChange={(value: UserRole) => setRole(value)} 
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
}
