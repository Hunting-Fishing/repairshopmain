
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { router } from "./routes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function AppRoutes() {
  const element = useRoutes(router.routes);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {element}
      </Suspense>
    </ErrorBoundary>
  );
}
