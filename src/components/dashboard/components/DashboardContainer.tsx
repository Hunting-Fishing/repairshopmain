
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  isModernTheme: boolean;
}

export function DashboardContainer({ children, isModernTheme }: DashboardContainerProps) {
  return (
    <div 
      className={cn(
        "min-h-screen animate-fade-in bg-gradient-to-br p-4 md:p-6",
        isModernTheme 
          ? "from-blue-50 via-white to-blue-50 dark:from-background/80 dark:via-background/50 dark:to-background/90"
          : "from-background/80 via-background/50 to-background/90"
      )}
    >
      {children}
    </div>
  );
}
