
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useViewState } from "@/hooks/useViewState";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardProvider } from "./DashboardProvider";
import { DashboardContainer } from "./components/DashboardContainer";

export function DashboardLayout() {
  const { viewState, updateViewState } = useViewState('dashboard');
  const isModernTheme = true;

  return (
    <ErrorBoundary>
      <DashboardProvider>
        <DashboardContainer isModernTheme={isModernTheme}>
          <DashboardHeader />
          <DashboardContent />
        </DashboardContainer>
      </DashboardProvider>
    </ErrorBoundary>
  );
}
