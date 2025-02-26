
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "../PasswordStrengthIndicator";
import { PasswordError } from "@/utils/auth/passwordValidation";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface PersonalInformationSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  password: string;
  confirmPassword: string;
  passwordErrors: PasswordError;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInformationSection({
  register,
  errors,
  password,
  confirmPassword,
  passwordErrors,
  onPasswordChange,
  onConfirmPasswordChange,
}: PersonalInformationSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="firstName">Personal Information</Label>
      
      <div className="space-y-1">
        <Input
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long"
            },
            maxLength: {
              value: 15,
              message: "Username must be less than 15 characters"
            }
          })}
          id="username"
          placeholder="Username"
          aria-label="Username"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message as string}</p>
        )}
      </div>

      <Input
        {...register("firstName", { required: "First name is required" })}
        id="firstName"
        placeholder="First Name"
        aria-label="First name"
      />
      {errors.firstName && (
        <p className="text-sm text-red-500">{errors.firstName.message as string}</p>
      )}

      <Input
        {...register("lastName", { required: "Last name is required" })}
        id="lastName"
        placeholder="Last Name"
        aria-label="Last name"
      />
      {errors.lastName && (
        <p className="text-sm text-red-500">{errors.lastName.message as string}</p>
      )}

      <div className="space-y-1">
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format"
            }
          })}
          id="email"
          type="email"
          placeholder="Email"
          aria-label="Email address"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long"
              },
              maxLength: {
                value: 20,
                message: "Password must be less than 20 characters"
              }
            })}
            onChange={(e) => {
              onPasswordChange(e);
            }}
            aria-label="Password"
            aria-describedby="password-requirements"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message as string}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            onChange={onConfirmPasswordChange}
            aria-label="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <div id="password-requirements">
          <PasswordStrengthIndicator errors={passwordErrors} />
        </div>
      </div>

      <Input
        {...register("phoneNumber", { required: "Phone number is required" })}
        id="phoneNumber"
        placeholder="Phone Number"
        aria-label="Phone number"
      />
      {errors.phoneNumber && (
        <p className="text-sm text-red-500">{errors.phoneNumber.message as string}</p>
      )}
    </div>
  );
}
