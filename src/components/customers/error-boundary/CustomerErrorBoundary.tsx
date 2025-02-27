
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CustomerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Customer form error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Something went wrong</h3>
          </div>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred while rendering the customer form."}
          </p>
          <Button 
            variant="secondary" 
            onClick={this.handleReset}
            className="bg-white hover:bg-red-50"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
