
import { ReactNode } from "react";

interface CustomerContentContainerProps {
  children: ReactNode;
  isModernTheme: boolean;
  className?: string;
}

export function CustomerContentContainer({ 
  children, 
  isModernTheme,
  className = ""
}: CustomerContentContainerProps) {
  return (
    <div className={`${
      isModernTheme
        ? 'bg-white/80 backdrop-blur-sm'
        : 'bg-white'
    } rounded-xl shadow-lg p-6 animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
