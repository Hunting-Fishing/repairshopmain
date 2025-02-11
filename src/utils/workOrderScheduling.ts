
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ScheduleWorkOrderParams {
  workOrderId: string;
  technicianId: string;
  startTime: Date;
  estimatedDurationMinutes: number;
}

export async function scheduleWorkOrder({
  workOrderId,
  technicianId,
  startTime,
  estimatedDurationMinutes,
}: ScheduleWorkOrderParams) {
  try {
    // Calculate end time
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + estimatedDurationMinutes);

    // Check technician availability using our new database function
    const { data: isAvailable, error: availabilityError } = await supabase.rpc(
      'check_technician_availability',
      {
        p_technician_id: technicianId,
        p_start_time: startTime.toISOString(),
        p_end_time: endTime.toISOString()
      }
    );

    if (availabilityError) {
      throw new Error('Failed to check technician availability');
    }

    if (!isAvailable) {
      throw new Error('Technician is not available during this time slot');
    }

    // Begin transaction
    const { data: workOrder, error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        assigned_technician_id: technicianId,
        scheduling_status: 'scheduled',
        estimated_duration_minutes: estimatedDurationMinutes
      })
      .eq('id', workOrderId)
      .select()
      .single();

    if (workOrderError) throw workOrderError;

    // Create calendar booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        repair_job_id: workOrderId,
        assigned_technician_id: technicianId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        customer_name: workOrder.customer_name || 'Customer',
        job_description: workOrder.description,
        organization_id: workOrder.organization_id,
        status: 'scheduled',
        duration_minutes: estimatedDurationMinutes,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (bookingError) throw bookingError;

    toast.success('Work order successfully scheduled');
    return true;
  } catch (error: any) {
    console.error('Error scheduling work order:', error);
    toast.error(error.message || 'Failed to schedule work order');
    return false;
  }
}

export async function updateWorkOrderSchedule({
  workOrderId,
  technicianId,
  startTime,
  estimatedDurationMinutes,
}: ScheduleWorkOrderParams) {
  try {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + estimatedDurationMinutes);

    // Check technician availability
    const { data: isAvailable, error: availabilityError } = await supabase.rpc(
      'check_technician_availability',
      {
        p_technician_id: technicianId,
        p_start_time: startTime.toISOString(),
        p_end_time: endTime.toISOString()
      }
    );

    if (availabilityError) throw new Error('Failed to check technician availability');
    if (!isAvailable) throw new Error('Technician is not available during this time slot');

    // Update work order
    const { error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        estimated_duration_minutes: estimatedDurationMinutes
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

    // Update calendar booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: estimatedDurationMinutes,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('repair_job_id', workOrderId);

    if (bookingError) throw bookingError;

    toast.success('Work order schedule updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating work order schedule:', error);
    toast.error(error.message || 'Failed to update work order schedule');
    return false;
  }
}

export async function unscheduleWorkOrder(workOrderId: string) {
  try {
    // Update work order status
    const { error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        scheduling_status: 'unscheduled'
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

    // Delete calendar booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .delete()
      .eq('repair_job_id', workOrderId);

    if (bookingError) throw bookingError;

    toast.success('Work order unscheduled successfully');
    return true;
  } catch (error: any) {
    console.error('Error unscheduling work order:', error);
    toast.error(error.message || 'Failed to unschedule work order');
    return false;
  }
}
