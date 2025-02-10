
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useViewState } from "@/hooks/useViewState";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardContainer } from "./components/DashboardContainer";

export function DashboardLayout() {
  const { viewState, updateViewState } = useViewState('dashboard');
  const isModernTheme = true;

  return (
    <ErrorBoundary>
      <DashboardContainer isModernTheme={isModernTheme}>
        <DashboardHeader />
        <DashboardContent />
      </DashboardContainer>
    </ErrorBoundary>
  );
}
