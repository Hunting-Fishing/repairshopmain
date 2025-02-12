
import { useState } from "react";
import { CommunicationItem } from "../CommunicationItem";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
  const [dateOpen, setDateOpen] = useState(false);

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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <Select 
          onValueChange={(value) => updateFilter({ type: value as Communication['type'] })}
          value={filter.type ?? ''}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilter({ status: value as Communication['status'] })}
          value={filter.status ?? ''}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filter.dateRange ? (
                `${format(filter.dateRange.from, 'PP')} - ${format(filter.dateRange.to, 'PP')}`
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filter.dateRange?.from}
              selected={{
                from: filter.dateRange?.from,
                to: filter.dateRange?.to,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  updateFilter({ dateRange: { from: range.from, to: range.to } });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4">
        {communications.map((comm) => (
          <CommunicationItem key={comm.id} communication={comm} />
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange(page - 1)} />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
