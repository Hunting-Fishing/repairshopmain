
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function RateLimitAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Access Temporarily Blocked</AlertTitle>
      <AlertDescription>
        Too many attempts. Please try again in a few minutes.
      </AlertDescription>
    </Alert>
  );
}
