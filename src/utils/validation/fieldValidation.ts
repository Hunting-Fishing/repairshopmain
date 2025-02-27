
type ValidationResult = {
  isValid: boolean;
  type?: 'success' | 'error' | 'warning';
  message?: string;
  details?: string[];
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      isValid: false,
      type: 'error',
      message: 'Email is required'
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      type: 'error',
      message: 'Please enter a valid email address',
      details: [
        'Must contain an @ symbol',
        'Must have a domain name',
        'Cannot contain spaces'
      ]
    };
  }

  return {
    isValid: true,
    type: 'success',
    message: 'Valid email address'
  };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (!phone) {
    return {
      isValid: false,
      type: 'error',
      message: 'Phone number is required'
    };
  }

  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return {
      isValid: false,
      type: 'error',
      message: 'Please enter a valid phone number',
      details: [
        'Must contain only numbers',
        'Can start with + for international format',
        'Should be between 8 and 15 digits'
      ]
    };
  }

  return {
    isValid: true,
    type: 'success',
    message: 'Valid phone number'
  };
};
