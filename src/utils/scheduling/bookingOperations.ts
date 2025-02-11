
import { supabase } from "@/integrations/supabase/client";
import { CreateBookingParams } from "./types";
import { toast } from "sonner";

export async function createBooking({
  workOrderId,
  technicianId,
  startTime,
  endTime,
  organizationId,
  estimatedDurationMinutes,
  isMultiDay = false,
  parentBookingId,
  sequenceNumber = 1,
  remainingMinutes,
  totalDurationMinutes
}: CreateBookingParams) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    const { data: workOrder, error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .select('*')
      .eq('id', workOrderId)
      .single();

    if (workOrderError) throw workOrderError;

    console.log(`Creating ${isMultiDay ? 'multi-day' : 'single-day'} booking:`, {
      workOrderId,
      technicianId,
      startTime,
      endTime,
      sequenceNumber,
      remainingMinutes
    });

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        repair_job_id: workOrderId,
        assigned_technician_id: technicianId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        customer_name: workOrder.customer_name || 'Customer',
        job_description: workOrder.description,
        organization_id: organizationId,
        status: 'scheduled',
        duration_minutes: estimatedDurationMinutes,
        created_by: user?.id,
        updated_by: user?.id,
        is_multi_day: isMultiDay,
        parent_booking_id: parentBookingId,
        sequence_number: sequenceNumber,
        remaining_minutes: remainingMinutes,
        total_duration_minutes: totalDurationMinutes
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    console.log('Booking created successfully:', booking);
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateWorkOrderSchedule({
  workOrderId,
  technicianId,
  startTime,
  estimatedDurationMinutes,
}: {
  workOrderId: string;
  technicianId: string;
  startTime: Date;
  estimatedDurationMinutes: number;
}) {
  try {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + estimatedDurationMinutes);

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

    const { error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        estimated_duration_minutes: estimatedDurationMinutes
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

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
    const { error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        scheduling_status: 'unscheduled'
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

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

