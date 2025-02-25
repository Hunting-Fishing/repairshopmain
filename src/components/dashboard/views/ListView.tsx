
import { DataTable } from "../components/DataTable";
import { columns } from "../components/table/columns";
import { useViewState } from "@/hooks/useViewState";
import { useAppointments } from "@/hooks/useAppointments";
import { BaseView } from "./base/BaseView";
import { SearchBar } from "./base/SearchBar";

export function ListView() {
  const {
    viewState,
    updateViewState,
    isLoading: isViewStateLoading
  } = useViewState("list");

  // Provide default values when destructuring from viewState
  const {
    search_filters = { searchQuery: "" },
    pagination_settings = { itemsPerPage: 10, currentPage: 1 },
    sort_preferences = { field: "created_at", direction: "desc" }
  } = viewState || {};

  const { searchQuery = "" } = search_filters;
  const { itemsPerPage = 10, currentPage = 1 } = pagination_settings;
  const { field = "created_at", direction = "desc" } = sort_preferences;

  const { data: appointments, isLoading, error } = useAppointments({
    searchQuery,
    currentPage,
    itemsPerPage,
    sortField: field,
    sortDirection: direction
  });

  const handleSearchChange = (value: string) => {
    if (!viewState) return;
    
    updateViewState({
      search_filters: { ...viewState.search_filters, searchQuery: value }
    });
  };

  return (
    <BaseView error={error} isLoading={isLoading || isViewStateLoading}>
      <SearchBar value={searchQuery} onChange={handleSearchChange} />
      <DataTable 
        columns={columns} 
        data={appointments || []} 
        isLoading={isLoading}
      />
    </BaseView>
  );
}
