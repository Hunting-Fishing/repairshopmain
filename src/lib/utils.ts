
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
