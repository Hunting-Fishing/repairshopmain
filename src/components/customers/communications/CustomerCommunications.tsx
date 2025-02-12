
import { useState } from "react";
import { CommunicationHeader } from "./components/CommunicationHeader";
import { CommunicationList } from "./components/CommunicationList";
import { useCommunications } from "./hooks/useCommunications";
import { useCustomer } from "./hooks/useCustomer";
import type { CommunicationsFilter, CommunicationSort } from "./types";

interface CustomerCommunicationsProps {
  customerId: string;
}

export function CustomerCommunications({ customerId }: CustomerCommunicationsProps) {
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<CommunicationsFilter>({});
  const [sort, setSort] = useState<CommunicationSort>({ field: 'sent_at', direction: 'desc' });

  const { data: communications, isLoading } = useCommunications({
    customerId,
    filter,
    sort,
    page,
    pageSize: 10
  });

  const { data: customer } = useCustomer(customerId);

  return (
    <div className="space-y-4">
      <CommunicationHeader
        customerId={customerId}
        customerPhoneNumber={customer?.phone_number}
        isSMSDialogOpen={isSMSDialogOpen}
        setIsSMSDialogOpen={setIsSMSDialogOpen}
      />
      <CommunicationList
        communications={communications?.communications ?? []}
        isLoading={isLoading}
        total={communications?.total ?? 0}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />
    </div>
  );
}
