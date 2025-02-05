
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface CustomerInspectionsProps {
  customerId: string;
}

export function CustomerInspections({ customerId }: CustomerInspectionsProps) {
  const { data: inspections, isLoading } = useQuery({
    queryKey: ["inspections", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_inspections")
        .select(`
          *,
          vehicle:vehicles(make, model, year),
          inspector:profiles(first_name, last_name)
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading inspections...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inspections</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      <div className="grid gap-4">
        {inspections?.map((inspection) => (
          <Card key={inspection.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {inspection.vehicle?.year} {inspection.vehicle?.make} {inspection.vehicle?.model} - {inspection.inspection_type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <div className="text-sm font-medium">Findings</div>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {JSON.stringify(inspection.findings, null, 2)}
                  </pre>
                </div>
                {inspection.recommendations && (
                  <div>
                    <div className="text-sm font-medium">Recommendations</div>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(inspection.recommendations, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Performed by: {inspection.inspector.first_name} {inspection.inspector.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Date: {format(new Date(inspection.created_at), "PPp")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
