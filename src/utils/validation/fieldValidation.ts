
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePhoneNumber(phone: string, country?: CountryCode): ValidationResult {
  try {
    if (!phone) {
      return { isValid: false, message: "Phone number is required" };
    }

    const isValid = country 
      ? isValidPhoneNumber(phone, country)
      : isValidPhoneNumber(phone);

    if (!isValid) {
      return { 
        isValid: false, 
        message: "Please enter a valid phone number" 
      };
    }

    const phoneNumber = parsePhoneNumber(phone, country as CountryCode);
    return { 
      isValid: true, 
      message: phoneNumber ? phoneNumber.formatInternational() : undefined 
    };
  } catch (error) {
    return { 
      isValid: false, 
      message: "Invalid phone number format" 
    };
  }
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Please enter a valid email address"
    };
  }

  return { isValid: true };
}

export const FILE_RESTRICTIONS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    video: ['video/mp4', 'video/quicktime']
  }
};

export interface FileValidationResult extends ValidationResult {
  isDuplicate?: boolean;
  sizeError?: boolean;
  typeError?: boolean;
}

export function validateFile(file: File, existingFiles: File[] = []): FileValidationResult {
  // Check file size
  if (file.size > FILE_RESTRICTIONS.maxSize) {
    return {
      isValid: false,
      sizeError: true,
      message: `File size must be less than ${FILE_RESTRICTIONS.maxSize / 1024 / 1024}MB`
    };
  }

  // Check file type
  const allowedTypes = [
    ...FILE_RESTRICTIONS.allowedTypes.image,
    ...FILE_RESTRICTIONS.allowedTypes.document,
    ...FILE_RESTRICTIONS.allowedTypes.video
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      typeError: true,
      message: "File type not supported"
    };
  }

  // Check for duplicates by name
  const isDuplicateName = existingFiles.some(
    existingFile => existingFile.name === file.name
  );

  if (isDuplicateName) {
    return {
      isValid: false,
      isDuplicate: true,
      message: "A file with this name already exists"
    };
  }

  return { isValid: true };
}

export interface ValidationStatus {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}
