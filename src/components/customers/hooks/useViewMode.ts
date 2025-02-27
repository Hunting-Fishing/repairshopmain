
import { useState, useCallback } from "react";

export type ViewMode = "list" | "grid";

export function useViewMode(initialMode: ViewMode = "list") {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    handleViewModeChange
  };
}
