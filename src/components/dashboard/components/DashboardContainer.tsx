
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  isModernTheme: boolean;
}

export function DashboardContainer({ children, isModernTheme }: DashboardContainerProps) {
  return (
    <div 
      className={cn(
        "min-h-screen animate-fade-in p-4 md:p-6 lg:p-8",
        isModernTheme 
          ? "bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
