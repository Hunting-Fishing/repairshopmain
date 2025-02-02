import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function AppRoutes() {
  const element = useRoutes(routes);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <AppLayout>{element}</AppLayout>
      </Suspense>
    </ErrorBoundary>
  );
}