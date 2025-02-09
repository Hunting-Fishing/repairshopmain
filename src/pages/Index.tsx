
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";

export default function Index() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-white to-[#F8F9FF] dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">Dashboard</h1>
          <DashboardLayout />
        </div>
      </main>
    </Suspense>
  );
}
