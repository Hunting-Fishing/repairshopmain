import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Index() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardLayout />
    </Suspense>
  );
}