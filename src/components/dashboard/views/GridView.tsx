
import { AppointmentCard } from "../components/AppointmentCard";
import { useViewState } from "@/hooks/useViewState";
import { useAppointments } from "@/hooks/useAppointments";
import { BaseView } from "./base/BaseView";
import { SearchBar } from "./base/SearchBar";

export function GridView() {
  const {
    viewState,
    updateViewState,
    isLoading: isViewStateLoading
  } = useViewState("grid");

  const {
    search_filters: { searchQuery = "" },
    pagination_settings: { itemsPerPage = 12, currentPage = 1 },
    sort_preferences: { field = "created_at", direction = "desc" }
  } = viewState;

  const { data: appointments, isLoading, error } = useAppointments({
    searchQuery,
    currentPage,
    itemsPerPage,
    sortField: field,
    sortDirection: direction
  });

  const handleSearchChange = (value: string) => {
    updateViewState({
      search_filters: { ...viewState.search_filters, searchQuery: value }
    });
  };

  return (
    <BaseView error={error} isLoading={isLoading || isViewStateLoading}>
      <SearchBar value={searchQuery} onChange={handleSearchChange} />
      {appointments?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No appointments found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments?.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </BaseView>
  );
}
