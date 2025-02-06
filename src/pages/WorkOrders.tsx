
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewWorkOrderDialog } from "@/components/work-orders/NewWorkOrderDialog";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkOrder {
  id: string;
  customer: string;
  vehicle: string;
  description: string;
  status: string;
  date: string;
}

interface DatabaseWorkOrder {
  id: string;
  description: string;
  status: string;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string;
  };
  vehicles: {
    make: string;
    model: string;
    year: string;
  };
}

export default function WorkOrders() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchWorkOrders() {
      try {
        const { data, error } = await supabase
          .from('customer_repair_jobs')
          .select(`
            id,
            description,
            status,
            created_at,
            customers:customer_id (
              first_name,
              last_name
            ),
            vehicles:vehicle_id (
              make,
              model,
              year
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedOrders = (data as DatabaseWorkOrder[]).map(order => ({
          id: order.id,
          customer: order.customers ? `${order.customers.first_name} ${order.customers.last_name}` : 'N/A',
          vehicle: order.vehicles ? `${order.vehicles.year} ${order.vehicles.make} ${order.vehicles.model}` : 'N/A',
          description: order.description,
          status: order.status,
          date: new Date(order.created_at).toISOString().split('T')[0]
        }));

        setWorkOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        toast({
          title: "Error",
          description: "Failed to load work orders",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkOrders();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage repair jobs and track progress
          </p>
        </div>
        <NewWorkOrderDialog />
      </div>

      <div className="flex flex-col gap-4">
        <CustomerSearchCommand 
          onSelect={setSelectedCustomerId}
          className="max-w-2xl"
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading work orders...
                  </TableCell>
                </TableRow>
              ) : workOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No work orders found
                  </TableCell>
                </TableRow>
              ) : (
                workOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.vehicle}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
