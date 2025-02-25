
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidenav } from "./DashboardSidenav";

interface DashboardContainerProps {
  children: React.ReactNode;
  isModernTheme: boolean;
}

export function DashboardContainer({ children, isModernTheme }: DashboardContainerProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#F8F9FF] via-white to-[#F8F9FF] dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80">
        <DashboardSidenav />
        <div 
          className={cn(
            "flex-1 animate-fade-in p-4 md:p-6 lg:p-8",
            isModernTheme 
              ? "rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg shadow-xl border border-[#E2E8F0]/50 dark:border-blue-900/50"
              : "bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          )}
        >
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
