
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { toast } from "sonner";

interface SettingsChange {
  [key: string]: any;
}

export function StaffHistoryList() {
  const { data: history, isLoading, refetch } = useQuery({
    queryKey: ["staff-history"],
    queryFn: async () => {
      console.log("Fetching staff history...");
      const { data, error } = await supabase
        .from("staff_history")
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name
          ),
          changed_by_user:changed_by (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching staff history:", error);
        throw error;
      }
      console.log("Staff history data:", data);
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to changes in the staff_history table
    const channel = supabase
      .channel('staff_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_history'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          refetch();
          toast.info("Staff history updated");
        }
      )
      .subscribe(status => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getSettingsChangeDescription = (oldValue: string, newValue: string) => {
    try {
      const oldSettings: SettingsChange = oldValue ? JSON.parse(oldValue) : {};
      const newSettings: SettingsChange = newValue ? JSON.parse(newValue) : {};
      
      const changes: string[] = [];
      
      // Check each setting for changes
      if (oldSettings.showTechnicianWorkload !== newSettings.showTechnicianWorkload) {
        changes.push(`Workload visibility ${newSettings.showTechnicianWorkload ? 'enabled' : 'disabled'}`);
      }
      if (oldSettings.showTechnicianAvailability !== newSettings.showTechnicianAvailability) {
        changes.push(`Availability visibility ${newSettings.showTechnicianAvailability ? 'enabled' : 'disabled'}`);
      }
      if (oldSettings.showTechnicianStats !== newSettings.showTechnicianStats) {
        changes.push(`Stats visibility ${newSettings.showTechnicianStats ? 'enabled' : 'disabled'}`);
      }
      
      return changes.length > 0 ? changes.join(', ') : 'Settings were updated';
    } catch (e) {
      console.error('Error parsing settings:', e);
      return 'Settings were updated';
    }
  };

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  return (
    <ScrollArea className="h-[600px] border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Staff Member</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {entry.profiles?.first_name} {entry.profiles?.last_name}
              </TableCell>
              <TableCell>
                {entry.changed_by_user?.first_name} {entry.changed_by_user?.last_name}
              </TableCell>
              <TableCell>
                {entry.entity_type === 'technician_settings' ? 'Settings Update' : entry.change_type}
              </TableCell>
              <TableCell className="max-w-md">
                {entry.entity_type === 'technician_settings'
                  ? getSettingsChangeDescription(entry.old_value, entry.new_value)
                  : `${entry.field_name || 'Multiple fields'} was updated`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
