
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RepairJobsListProps {
  customerId: string;
}

export function RepairJobsList({ customerId }: RepairJobsListProps) {
  const { data: repairJobs, isLoading } = useQuery({
    queryKey: ["repair-jobs", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_repair_jobs")
        .select(`
          *,
          vehicle:vehicles(make, model, year),
          technician:profiles!customer_repair_jobs_assigned_technician_id_fkey(first_name, last_name)
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      quoted: "bg-blue-500",
      approved: "bg-yellow-500",
      in_progress: "bg-orange-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  if (isLoading) return <div>Loading repair jobs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Repair Jobs</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Repair Job
        </Button>
      </div>

      <div className="grid gap-4">
        {repairJobs?.map((job) => (
          <Card key={job.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}
              </CardTitle>
              <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground">{job.description}</div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Quoted Amount</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(job.quoted_amount)}
                    </div>
                  </div>
                  {job.approved_amount && (
                    <div>
                      <div className="text-sm font-medium">Approved Amount</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(job.approved_amount)}
                      </div>
                    </div>
                  )}
                  {job.actual_amount && (
                    <div>
                      <div className="text-sm font-medium">Actual Amount</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(job.actual_amount)}
                      </div>
                    </div>
                  )}
                </div>
                {job.technician && (
                  <div>
                    <div className="text-sm font-medium">Assigned Technician</div>
                    <div className="text-sm text-muted-foreground">
                      {job.technician.first_name} {job.technician.last_name}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
