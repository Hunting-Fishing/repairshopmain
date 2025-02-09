
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";

export default function Index() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="min-h-screen">
        <DashboardLayout />
      </main>
    </Suspense>
  );
}
