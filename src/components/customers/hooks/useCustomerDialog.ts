
import { useState, useCallback } from "react";

export function useCustomerDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleCustomerAdded = useCallback((callback?: () => void) => {
    setIsDialogOpen(false);
    if (callback) callback();
  }, []);

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    handleCustomerAdded
  };
}
