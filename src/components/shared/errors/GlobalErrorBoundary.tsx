
import { ErrorBoundary } from "./ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A critical error has occurred. Please refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
