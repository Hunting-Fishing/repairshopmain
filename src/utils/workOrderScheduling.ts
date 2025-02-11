import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessHours } from "@/types/bookings";

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

    // Check technician availability using our database function
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
      throw new Error('Technician is not available during this time slot or it is outside business hours');
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
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        required_parts: workOrder.required_parts,
        parts_status: workOrder.parts_status
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

export async function getBusinessHours(organizationId: string): Promise<BusinessHours | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_settings')
      .select('business_hours')
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data?.business_hours;
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return null;
  }
}

export async function checkBusinessHours(organizationId: string, startTime: Date): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      'check_business_hours',
      {
        p_organization_id: organizationId,
        p_start_time: startTime.toISOString()
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking business hours:', error);
    return false;
  }
}
