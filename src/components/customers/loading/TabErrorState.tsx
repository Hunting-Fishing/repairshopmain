
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TabErrorStateProps {
  error: Error;
  resetError?: () => void;
}

export const TabErrorState = ({ error, resetError }: TabErrorStateProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p>{error.message}</p>
        {resetError && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetError}
            className="w-fit"
          >
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
