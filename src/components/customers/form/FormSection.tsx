
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  isModernTheme?: boolean;
  defaultExpanded?: boolean;
  description?: string;
}

export function FormSection({ 
  title, 
  children, 
  isModernTheme = false,
  defaultExpanded = true,
  description
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left mb-4 flex items-center justify-between group ${
          isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-full transition-colors ${
            isModernTheme 
              ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] group-hover:from-[#EA580C] group-hover:to-[#F97316]' 
              : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3] group-hover:from-[#FDE1D3] group-hover:to-[#FEC6A1]'
          }`} />
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      
      <div className={`transition-all duration-200 ease-in-out overflow-hidden ${
        isExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'
      }`}>
        <div className={`rounded-lg p-6 ${
          isModernTheme
            ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
            : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
}
