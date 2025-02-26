
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AsyncOperationProps<T> {
  operation: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  errorMessage?: string;
  children: (state: {
    isLoading: boolean;
    error: Error | null;
    data: T | null;
    retry: () => void;
  }) => React.ReactNode;
}

export function AsyncOperation<T>({
  operation,
  onSuccess,
  onError,
  loadingMessage = "Loading...",
  errorMessage = "An error occurred",
  children,
}: AsyncOperationProps<T>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<T | null>(null);
  const [progress, setProgress] = React.useState(0);

  const executeOperation = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    try {
      const result = await operation();
      setData(result);
      setProgress(100);
      onSuccess?.(result);
      toast.success("Operation completed successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);
      onError?.(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  const retry = () => {
    executeOperation();
  };

  React.useEffect(() => {
    executeOperation();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={retry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          <Progress value={progress} className="w-full" />
        </div>
      )}
      {children({ isLoading, error, data, retry })}
    </div>
  );
}
