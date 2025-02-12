
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  isModernTheme?: boolean;
}

export function FormSection({ title, children, isModernTheme = false }: FormSectionProps) {
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        isModernTheme ? 'text-gradient-primary' : 'text-gray-800'
      }`}>
        <span className={`p-1.5 rounded-full ${
          isModernTheme 
            ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C]' 
            : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
        }`}></span>
        {title}
      </h3>
      <div className={`rounded-lg p-6 ${
        isModernTheme
          ? 'bg-gradient-to-br from-white via-orange-50 to-orange-100/30 shadow-[0_8px_16px_-6px_rgba(249,115,22,0.2)] border border-orange-200/50 backdrop-blur-sm'
          : 'bg-gradient-to-br from-white to-[#FDE1D3]/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-[#FEC6A1]/20'
      }`}>
        {children}
      </div>
    </div>
  );
}
