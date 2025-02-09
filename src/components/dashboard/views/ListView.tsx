
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

export function ListView() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("bookings")
        .select("*, profiles(first_name, last_name)")
        .order("start_time", { ascending: true });

      if (searchQuery) {
        query.textSearch("customer_name", searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
