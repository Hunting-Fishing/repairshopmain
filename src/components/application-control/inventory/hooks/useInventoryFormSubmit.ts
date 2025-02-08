
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import type { InventoryItem } from "../types";

interface UseInventoryFormSubmitProps {
  form: UseFormReturn<any>;
  onSubmit: (data: Partial<InventoryItem>) => void;
  originalData?: InventoryItem;
}

export function useInventoryFormSubmit({
  form,
  onSubmit,
  originalData,
}: UseInventoryFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changes, setChanges] = useState<Record<string, { old: any; new: any }> | null>(null);

  const watchAllFields = form.watch();

  useEffect(() => {
    if (!originalData) return;

    const changedFields = Object.entries(watchAllFields).reduce((acc, [key, value]) => {
      if (originalData[key as keyof InventoryItem] !== value) {
        acc[key] = {
          old: originalData[key as keyof InventoryItem],
          new: value,
        };
      }
      return acc;
    }, {} as Record<string, { old: any; new: any }>);

    setChanges(Object.keys(changedFields).length > 0 ? changedFields : null);
  }, [watchAllFields, originalData]);

  const handleSubmit = async (data: Partial<InventoryItem>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    changes,
  };
}
