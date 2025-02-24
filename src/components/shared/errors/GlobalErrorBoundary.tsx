
import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: React.ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: {
    type: "unknown" | "network" | "server" | null;
    code?: string;
    details?: string;
  };
}

export class GlobalErrorBoundary extends React.Component<Props, ErrorState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: {
        type: null,
      },
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    // Categorize the error
    const errorInfo = {
      type: "unknown" as const,
      details: error.message,
    };

    if (error.message.includes("network") || error.message.includes("fetch")) {
      errorInfo.type = "network";
    } else if (error.message.includes("500") || error.message.includes("server")) {
      errorInfo.type = "server";
    }

    return {
      hasError: true,
      error,
      errorInfo,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to audit_logs table via Supabase
    console.error("Error caught by boundary:", error, errorInfo);
    this.logError(error, errorInfo);
  }

  private async logError(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("audit_logs").insert({
        action_type: "error",
        table_name: "client_errors",
        old_data: null,
        new_data: {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          type: this.state.errorInfo.type,
        },
        level: "error",
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
  }

  private getErrorMessage(): string {
    switch (this.state.errorInfo.type) {
      case "network":
        return "Unable to connect to the server. Please check your internet connection.";
      case "server":
        return "The server encountered an error. Our team has been notified.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription className="mt-2">
              {this.getErrorMessage()}
              {this.state.errorInfo.details && (
                <div className="mt-2 text-sm opacity-75">
                  Details: {this.state.errorInfo.details}
                </div>
              )}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
