
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  details?: string[];
}

export function validatePhoneNumber(phone: string, country?: CountryCode): ValidationResult {
  try {
    if (!phone) {
      return { 
        isValid: false, 
        message: "Phone number is required",
        type: 'error'
      };
    }

    if (phone.length < 8) {
      return {
        isValid: false,
        message: "Phone number is too short",
        type: 'error',
        details: ["Phone number must be at least 8 digits"]
      };
    }

    const isValid = country 
      ? isValidPhoneNumber(phone, country)
      : isValidPhoneNumber(phone);

    if (!isValid) {
      return { 
        isValid: false, 
        message: "Invalid phone number format",
        type: 'error',
        details: [
          "Check country code format (e.g., +1 for US)",
          "Ensure area code is valid",
          "Remove any invalid characters"
        ]
      };
    }

    const phoneNumber = parsePhoneNumber(phone, country as CountryCode);
    return { 
      isValid: true, 
      message: phoneNumber ? phoneNumber.formatInternational() : undefined,
      type: 'success' 
    };
  } catch (error) {
    return { 
      isValid: false, 
      message: "Invalid phone number format",
      type: 'error',
      details: ["The phone number format is not recognized"]
    };
  }
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { 
      isValid: false, 
      message: "Email is required",
      type: 'error'
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      message: "Invalid email format",
      type: 'error',
      details: ["Email must contain exactly one @ symbol"]
    };
  }

  const [username, domain] = parts;

  if (!username) {
    return {
      isValid: false,
      message: "Missing username",
      type: 'error',
      details: ["Username part before @ is required"]
    };
  }

  if (!domain) {
    return {
      isValid: false,
      message: "Missing domain",
      type: 'error',
      details: ["Domain part after @ is required"]
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      message: "Invalid domain format",
      type: 'error',
      details: ["Domain must include at least one dot (.)"]
    };
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Invalid email format",
      type: 'error',
      details: [
        "Use only letters, numbers, dots, hyphens, and underscores",
        "Domain must have a valid extension"
      ]
    };
  }

  return { 
    isValid: true,
    type: 'success',
    message: "Valid email address"
  };
}

export const FILE_RESTRICTIONS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    video: ['video/mp4', 'video/quicktime']
  },
  allowedExtensions: {
    image: ['.jpg', '.jpeg', '.png', '.gif'],
    document: ['.pdf', '.doc', '.docx'],
    video: ['.mp4', '.mov']
  }
};

export interface FileValidationResult extends ValidationResult {
  isDuplicate?: boolean;
  sizeError?: boolean;
  typeError?: boolean;
  details: string[];
}

export function validateFile(file: File, existingFiles: File[] = []): FileValidationResult {
  const errors: string[] = [];
  let mainError = '';

  // Check file size
  if (file.size > FILE_RESTRICTIONS.maxSize) {
    mainError = `File size exceeds limit`;
    errors.push(`Maximum file size is ${FILE_RESTRICTIONS.maxSize / 1024 / 1024}MB`);
    errors.push(`Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    return {
      isValid: false,
      sizeError: true,
      message: mainError,
      type: 'error',
      details: errors
    };
  }

  // Check file type
  const allowedTypes = [
    ...FILE_RESTRICTIONS.allowedTypes.image,
    ...FILE_RESTRICTIONS.allowedTypes.document,
    ...FILE_RESTRICTIONS.allowedTypes.video
  ];

  if (!allowedTypes.includes(file.type)) {
    mainError = 'File type not supported';
    errors.push('Supported file types:');
    Object.entries(FILE_RESTRICTIONS.allowedExtensions).forEach(([category, extensions]) => {
      errors.push(`${category}: ${extensions.join(', ')}`);
    });
    return {
      isValid: false,
      typeError: true,
      message: mainError,
      type: 'error',
      details: errors
    };
  }

  // Check for duplicates
  const isDuplicateName = existingFiles.some(
    existingFile => existingFile.name === file.name
  );

  if (isDuplicateName) {
    mainError = 'Duplicate file detected';
    errors.push('A file with this name already exists');
    errors.push('Try renaming the file or choose a different one');
    return {
      isValid: false,
      isDuplicate: true,
      message: mainError,
      type: 'error',
      details: errors
    };
  }

  return { 
    isValid: true,
    message: 'File is valid',
    type: 'success',
    details: [`File "${file.name}" is ready to upload`]
  };
}

export interface ValidationStatus {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string[];
}
