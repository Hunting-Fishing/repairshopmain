
import { Suspense } from "react";
import { TabLoadingSkeleton } from "./loading/TabLoadingSkeleton";
import { TabErrorState } from "./loading/TabErrorState";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface CustomerTabContentProps {
  children: React.ReactNode;
  label: string;
}

export const CustomerTabContent = ({ children, label }: CustomerTabContentProps) => {
  return (
    <ErrorBoundary
      fallbackComponent={({ error, reset }) => (
        <TabErrorState 
          message={`Failed to load ${label}. Please try again later.`}
          error={error}
          resetError={reset}
        />
      )}
    >
      <Suspense fallback={<TabLoadingSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
