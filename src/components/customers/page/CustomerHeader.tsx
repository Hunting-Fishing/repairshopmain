
import { Users } from "lucide-react";

interface CustomerHeaderProps {
  isModernTheme?: boolean;
}

export function CustomerHeader({ isModernTheme = false }: CustomerHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 ${
        isModernTheme 
          ? 'bg-white/90 shadow-md'
          : 'bg-white/90 shadow-md'
      } rounded-full`}>
        <Users className={`h-7 w-7 ${
          isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
        }`} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Customers
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your customer database efficiently
        </p>
      </div>
    </div>
  );
}
