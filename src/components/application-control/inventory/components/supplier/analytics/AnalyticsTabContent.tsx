import { AnalyticsOverview } from "./AnalyticsOverview";
import type { SupplierAnalyticsData } from "../../../types";

interface AnalyticsTabContentProps {
  analytics: SupplierAnalyticsData;
}

export function AnalyticsTabContent({ analytics }: AnalyticsTabContentProps) {
  return (
    <div className="space-y-8">
      <AnalyticsOverview analytics={analytics} />
    </div>
  );
}