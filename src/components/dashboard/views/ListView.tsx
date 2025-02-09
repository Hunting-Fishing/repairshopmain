
import { Card } from "@/components/ui/card";
import { StatsCards } from "../StatsCards";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "../components/DataTable";
import { columns } from "../components/table/columns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useViewState } from "@/hooks/useViewState";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";

export function ListView() {
  const {
    viewState,
    updateViewState,
    isLoading: isViewStateLoading
  } = useViewState("list");

  const {
    search_filters: { searchQuery = "" },
    pagination_settings: { itemsPerPage = 10, currentPage = 1 },
    sort_preferences: { field = "created_at", direction = "desc" }
  } = viewState;

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments", searchQuery, currentPage, itemsPerPage, field, direction],
    queryFn: async () => {
      const query = supabase
        .from("bookings")
        .select("*, profiles(first_name, last_name)")
        .order(field, { ascending: direction === "asc" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchQuery) {
        query.textSearch("customer_name", searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
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

  if (isLoading || isViewStateLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <StatsCards />
        </Card>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
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
        <DataTable 
          columns={columns} 
          data={appointments || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
