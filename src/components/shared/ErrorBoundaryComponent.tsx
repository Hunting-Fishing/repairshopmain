
import React, { Component, ErrorInfo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isFallbackError: boolean;
}

export class ErrorBoundaryComponent extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isFallbackError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isFallbackError: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    const { hasError, error, isFallbackError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (isFallbackError || !fallback) {
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>{error?.message || "An unexpected error occurred"}</p>
              <Button 
                variant="outline" 
                onClick={this.handleReset}
                className="w-fit"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        );
      }

      try {
        return fallback;
      } catch (fallbackError) {
        this.setState({ isFallbackError: true });
        return null;
      }
    }

    return children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback: React.ReactNode = <LoadingSpinner />,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundaryComponent fallback={fallback} onError={onError}>
        <WrappedComponent {...props} />
      </ErrorBoundaryComponent>
    );
  };
}
