
export interface HistoryRecord {
  id: string;
  changed_by: string;
  change_type: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  notes: string | null;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface CustomerHistoryListProps {
  customerId: string;
}

export interface HistoryFiltersProps {
  filterField: string;
  filterType: string;
  uniqueFields: string[];
  uniqueTypes: string[];
  onFilterFieldChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onExport: () => void;
}

export interface HistoryStatisticsProps {
  statistics: {
    byType: Record<string, number>;
    byField: Record<string, number>;
  };
}

export interface HistoryTableProps {
  groupedRecords: Record<string, HistoryRecord[]>;
}
