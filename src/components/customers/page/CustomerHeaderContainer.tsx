
import { ReactNode } from "react";

interface CustomerHeaderContainerProps {
  children: ReactNode;
  isModernTheme: boolean;
}

export function CustomerHeaderContainer({ 
  children, 
  isModernTheme 
}: CustomerHeaderContainerProps) {
  return (
    <div className={`rounded-xl p-8 shadow-lg ${
      isModernTheme 
        ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50'
        : 'bg-white'
    }`}>
      {children}
    </div>
  );
}
