
import { Card } from "@/components/ui/card";
import { StatsCards } from "../StatsCards";
import { AppointmentCard } from "../components/AppointmentCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useViewState } from "@/hooks/useViewState";
import { useAppointments } from "@/hooks/useAppointments";

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load appointments: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <StatsCards />
      </Card>
      
      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading || isViewStateLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px]" />
            ))}
          </div>
        ) : appointments?.length === 0 ? (
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
      </Card>
    </div>
  );
}
