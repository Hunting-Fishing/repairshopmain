
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "../PasswordStrengthIndicator";
import { PasswordError } from "@/utils/auth/passwordValidation";

interface PersonalInformationSectionProps {
  password: string;
  confirmPassword: string;
  passwordErrors: PasswordError;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInformationSection({
  password,
  confirmPassword,
  passwordErrors,
  onPasswordChange,
  onConfirmPasswordChange,
}: PersonalInformationSectionProps) {
  return (
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
          onChange={onPasswordChange}
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
          onChange={onConfirmPasswordChange}
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
  );
}
