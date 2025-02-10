
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface BaseViewProps {
  error?: Error | null;
  isLoading: boolean;
  children: ReactNode;
}

export function BaseView({ error, isLoading, children }: BaseViewProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load data: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      ) : (
        children
      )}
    </Card>
  );
}
