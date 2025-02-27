
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
  isModernTheme?: boolean;
}

export function FormSection({ 
  title, 
  children, 
  description,
  isModernTheme = false 
}: FormSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className={`text-lg font-semibold ${
          isModernTheme ? 'text-gray-900' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className={`p-6 rounded-lg border ${
        isModernTheme 
          ? 'bg-white/50 backdrop-blur-sm border-orange-100/50 shadow-lg shadow-orange-100/20'
          : 'bg-white border-gray-100 shadow-sm'
      }`}>
        {children}
      </div>
    </div>
  );
}
