
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PartsTab } from "@/components/repair/PartsTab";
import { LaborTab } from "@/components/repair/LaborTab";
import { HistoryTab } from "@/components/repair/HistoryTab";
import { BasicDetails } from "@/components/repair/details/BasicDetails";

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
          <BasicDetails data={repairJob} />
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
