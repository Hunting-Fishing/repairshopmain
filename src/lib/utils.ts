
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with locale support
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date with locale support
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));
}

// Format file size with appropriate units
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Add keyframes for shake animation to your Tailwind CSS config
const shakeKeyframes = {
  '0%, 100%': { transform: 'translateX(0)' },
  '25%': { transform: 'translateX(-8px)' },
  '75%': { transform: 'translateX(8px)' },
};

// Add animation to your Tailwind CSS config
const animationConfig = {
  'shake': 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
};

// Export for use in tailwind.config.js if needed
export const tailwindConfig = {
  theme: {
    extend: {
      keyframes: {
        shake: shakeKeyframes,
      },
      animation: animationConfig,
    },
  },
};
