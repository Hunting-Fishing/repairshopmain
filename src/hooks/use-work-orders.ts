
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DatabaseWorkOrder {
  id: string;
  description: string;
  status: string;
  created_at: string;
  customer_id: string;
  vehicle_id: string;
  customers: {
    first_name: string;
    last_name: string;
  } | null;
  vehicles: {
    make: string;
    model: string;
    year: string;
  } | null;
}

interface WorkOrder {
  id: string;
  customer: string;
  vehicle: string;
  description: string;
  status: string;
  date: string;
}

export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_repair_jobs')
        .select(`
          id,
          description,
          status,
          created_at,
          customer_id,
          vehicle_id,
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
        .order('created_at', { ascending: false })
        .returns<DatabaseWorkOrder[]>();

      if (error) throw error;

      const formattedOrders = data.map(order => ({
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
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [toast]);

  useEffect(() => {
    const channel = supabase
      .channel('work-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_repair_jobs'
        },
        (payload) => {
          console.log('Work order change detected:', payload);
          fetchWorkOrders();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Work Order",
              description: "A new work order has been created",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return { workOrders, isLoading, fetchWorkOrders };
}
