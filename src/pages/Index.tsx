
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function Index() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <main className="min-h-screen">
          <DashboardLayout />
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
