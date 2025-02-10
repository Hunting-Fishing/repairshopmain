
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { PartsTab } from "@/components/repair/PartsTab";
import { LaborTab } from "@/components/repair/LaborTab";
import { HistoryTab } from "@/components/repair/HistoryTab";

interface RepairJobDetails {
  id: string;
  customer: {
    first_name: string;
    last_name: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
  };
  description: string;
  status: string;
  quoted_amount: number;
  approved_amount: number;
  actual_amount: number;
  created_at: string;
  technician: {
    first_name: string;
    last_name: string;
  } | null;
}

export default function RepairJobDetails() {
  const { id } = useParams();

  const { data: repairJob, isLoading } = useQuery({
    queryKey: ['repair-job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_repair_jobs')
        .select(`
          *,
          customer:customer_id (first_name, last_name),
          vehicle:vehicle_id (make, model, year),
          technician:assigned_technician_id (first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Failed to load repair job details");
        throw error;
      }

      return data as RepairJobDetails;
    }
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

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!repairJob) {
    return <div>Repair job not found</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Repair Job Details</h1>
        <Badge className={getStatusColor(repairJob.status)}>
          {repairJob.status}
        </Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{repairJob.customer.first_name} {repairJob.customer.last_name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {repairJob.vehicle.year} {repairJob.vehicle.make} {repairJob.vehicle.model}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Description:</strong> {repairJob.description}</p>
                  <p><strong>Created:</strong> {format(new Date(repairJob.created_at), 'PPp')}</p>
                  {repairJob.technician && (
                    <p>
                      <strong>Technician:</strong> {repairJob.technician.first_name} {repairJob.technician.last_name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Quoted Amount:</strong> ${repairJob.quoted_amount}</p>
                  {repairJob.approved_amount && (
                    <p><strong>Approved Amount:</strong> ${repairJob.approved_amount}</p>
                  )}
                  {repairJob.actual_amount && (
                    <p><strong>Actual Amount:</strong> ${repairJob.actual_amount}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parts">
          <PartsTab repairJobId={id!} />
        </TabsContent>

        <TabsContent value="labor">
          <LaborTab repairJobId={id!} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab repairJobId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
