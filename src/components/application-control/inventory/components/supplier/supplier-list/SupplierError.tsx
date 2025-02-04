import { Alert, AlertDescription } from "@/components/ui/alert";

interface SupplierErrorProps {
  error: Error;
}

export function SupplierError({ error }: SupplierErrorProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load suppliers: {error.message}
        </AlertDescription>
      </Alert>
    </div>
  );
}