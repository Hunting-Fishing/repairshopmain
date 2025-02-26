import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SupplierErrorBoundaryProps {
  error: Error | null;
}

export function SupplierErrorBoundary({ error }: SupplierErrorBoundaryProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'An error occurred while loading supplier data'}
      </AlertDescription>
    </Alert>
  );
}