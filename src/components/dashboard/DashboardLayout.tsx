
import { useCallback, useMemo } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardContainer } from "./components/DashboardContainer";
import { useDashboardContext } from "@/contexts/DashboardContext";

export function DashboardLayout() {
  const { isModernTheme } = useDashboardContext();

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
