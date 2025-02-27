
import { useCallback, useMemo } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardContainer } from "./components/DashboardContainer";
import { useDashboard } from "@/contexts/DashboardContext";

export function DashboardLayout() {
  // Change from useDashboardContext to useDashboard
  const { state } = useDashboard();
  const isModernTheme = true; // Default to true as a fallback

  const renderContent = useCallback(() => {
    return (
      <>
        <DashboardHeader />
        <DashboardContent />
      </>
    );
  }, []);

  const content = useMemo(() => renderContent(), [renderContent]);

  return (
    <DashboardContainer isModernTheme={isModernTheme}>
      {content}
    </DashboardContainer>
  );
}
