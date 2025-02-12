
import { useState } from "react";
import { CommunicationItem } from "../CommunicationItem";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { Communication, CommunicationsFilter, CommunicationSort } from "../../types";

interface CommunicationListProps {
  communications: Communication[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: CommunicationsFilter) => void;
  onSortChange: (sort: CommunicationSort) => void;
}

const typeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'DocuSign', value: 'docusign' },
  { label: 'Notification', value: 'notification' }
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' }
];

export function CommunicationList({ 
  communications,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
  onFilterChange,
  onSortChange
}: CommunicationListProps) {
  const [filter, setFilter] = useState<CommunicationsFilter>({});

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (communications.length === 0) {
    return <EmptyState />;
  }

  const updateFilter = (updates: Partial<CommunicationsFilter>) => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <Select
          options={typeOptions}
          value={filter.type ?? ''}
          onValueChange={(value) => updateFilter({ type: value as Communication['type'] })}
          placeholder="Filter by type"
        />
        <Select
          options={statusOptions}
          value={filter.status ?? ''}
          onValueChange={(value) => updateFilter({ status: value as Communication['status'] })}
          placeholder="Filter by status"
        />
        <DateRangePicker
          value={filter.dateRange}
          onChange={(range) => updateFilter({ dateRange: range })}
        />
      </div>

      <div className="grid gap-4">
        {communications.map((comm) => (
          <CommunicationItem key={comm.id} communication={comm} />
        ))}
      </div>

      <Pagination
        total={total}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
