
import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject } from "react";
import { CustomerFormValues } from "../types/customerTypes";

interface UseAddressVirtualizerProps {
  parentRef: RefObject<HTMLDivElement>;
  addresses: CustomerFormValues['address_book'];
}

export function useAddressVirtualizer({ parentRef, addresses }: UseAddressVirtualizerProps) {
  const virtualizer = useVirtualizer({
    count: addresses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  return virtualizer;
}
