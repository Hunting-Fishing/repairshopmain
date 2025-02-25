
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { WorkOrderFiltersType, SortConfig } from "@/pages/WorkOrders";

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

export function useWorkOrders(filters?: WorkOrderFiltersType, sortConfig?: SortConfig) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkOrders = async () => {
    try {
      let query = supabase
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
        `);

      // Apply filters
      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      // Apply sorting
      if (sortConfig) {
        query = query.order(sortConfig.field, { 
          ascending: sortConfig.direction === 'asc'
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.returns<DatabaseWorkOrder[]>();

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

  const updateWorkOrders = async (ids: string[], updates: Partial<WorkOrder>) => {
    const { error } = await supabase
      .from('customer_repair_jobs')
      .update(updates)
      .in('id', ids);

    if (error) throw error;
    await fetchWorkOrders();
  };

  const deleteWorkOrders = async (ids: string[]) => {
    const { error } = await supabase
      .from('customer_repair_jobs')
      .delete()
      .in('id', ids);

    if (error) throw error;
    await fetchWorkOrders();
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [filters, sortConfig, toast]);

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

  return { workOrders, isLoading, fetchWorkOrders, updateWorkOrders, deleteWorkOrders };
}
