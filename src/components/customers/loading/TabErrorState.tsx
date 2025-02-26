
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface TabErrorStateProps {
  message?: string;
  onRetry?: () => void;
  error?: Error;
  resetError?: () => void;
}

export function TabErrorState({ 
  message = "There was a problem loading this section.",
  onRetry,
  error,
  resetError
}: TabErrorStateProps) {
  const errorMessage = error?.message || message;
  const handleRetry = resetError || onRetry;

  return (
    <Alert variant="destructive" className="mx-auto max-w-2xl my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{errorMessage}</p>
        {handleRetry && (
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="w-fit"
          >
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
