
import { PasswordError } from "@/utils/auth/passwordValidation";

interface PasswordStrengthIndicatorProps {
  errors: PasswordError;
}

export function PasswordStrengthIndicator({ errors }: PasswordStrengthIndicatorProps) {
  return (
    <div className="text-sm space-y-1" role="alert" aria-live="polite">
      <p className={errors.isLongEnough ? "text-green-600" : "text-red-600"}>
        ✓ At least 8 characters
      </p>
      <p className={errors.hasUpperCase ? "text-green-600" : "text-red-600"}>
        ✓ One uppercase letter
      </p>
      <p className={errors.hasLowerCase ? "text-green-600" : "text-red-600"}>
        ✓ One lowercase letter
      </p>
      <p className={errors.hasNumber ? "text-green-600" : "text-red-600"}>
        ✓ One number
      </p>
      <p className={errors.hasSpecialChar ? "text-green-600" : "text-red-600"}>
        ✓ One special character
      </p>
    </div>
  );
}
