
export interface PasswordError {
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
  isLongEnough: boolean;
}

export function validatePassword(value: string): PasswordError {
  return {
    hasNumber: /\d/.test(value),
    hasUpperCase: /[A-Z]/.test(value),
    hasLowerCase: /[a-z]/.test(value),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    isLongEnough: value.length >= 8,
  };
}

export function isPasswordValid(errors: PasswordError): boolean {
  return Object.values(errors).every(Boolean);
}
