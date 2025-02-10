
export interface ViewState {
  id?: string;
  user_id?: string;
  view_type: string;
  state: Record<string, any>;
  search_filters?: Record<string, any>;
  sort_preferences?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination_settings?: {
    itemsPerPage: number;
    currentPage: number;
  };
  is_calendar_expanded?: boolean;
  view_mode: 'calendar' | 'grid' | 'list';
}

export interface AppointmentFilters {
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
