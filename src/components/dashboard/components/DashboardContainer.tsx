
interface DashboardContainerProps {
  children: React.ReactNode;
  isModernTheme: boolean;
}

export function DashboardContainer({ children, isModernTheme }: DashboardContainerProps) {
  return (
    <div className={`min-h-screen animate-fade-in bg-gradient-to-br ${
      isModernTheme 
        ? 'from-blue-50 via-white to-blue-50'
        : 'from-background/80 via-background/50 to-background/90'
    } p-4 md:p-6`}>
      {children}
    </div>
  );
}
