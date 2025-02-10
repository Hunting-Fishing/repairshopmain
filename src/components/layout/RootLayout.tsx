
import { ErrorBoundaryWrapper } from "./ErrorBoundaryWrapper";
import { Toaster } from "@/components/ui/sonner";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-background">
        {children}
        <Toaster />
      </div>
    </ErrorBoundaryWrapper>
  );
}
