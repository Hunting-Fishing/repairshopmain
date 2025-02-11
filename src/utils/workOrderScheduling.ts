import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessHours } from "@/types/bookings";

export interface ScheduleWorkOrderParams {
  workOrderId: string;
  technicianId: string;
  startTime: Date;
  estimatedDurationMinutes: number;
}

async function calculateWorkDayEndTime(organizationId: string, date: Date): Promise<Date> {
  const { data: settings } = await supabase
    .from('calendar_settings')
    .select('business_hours')
    .eq('organization_id', organizationId)
    .single();

  if (!settings?.business_hours) {
    throw new Error('Business hours not configured');
  }

  const dayName = date.toLocaleLowerCase().split(',')[0];
  const dayHours = settings.business_hours[dayName];
  
  if (!dayHours) {
    throw new Error('No business hours set for this day');
  }

  const endTime = new Date(date);
  const [hours, minutes] = dayHours.end.split(':');
  endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return endTime;
}

async function createBooking(
  workOrderId: string,
  technicianId: string,
  startTime: Date,
  endTime: Date,
  organizationId: string,
  estimatedDurationMinutes: number,
  isMultiDay: boolean = false,
  parentBookingId?: string,
  sequenceNumber: number = 1,
  remainingMinutes?: number,
  totalDurationMinutes?: number
) {
  const user = (await supabase.auth.getUser()).data.user;
  
  const { data: workOrder, error: workOrderError } = await supabase
    .from('customer_repair_jobs')
    .select('*')
    .eq('id', workOrderId)
    .single();

  if (workOrderError) throw workOrderError;

  const { error: bookingError } = await supabase
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
    });

  if (bookingError) throw bookingError;
}

export async function scheduleWorkOrder({
  workOrderId,
  technicianId,
  startTime,
  estimatedDurationMinutes,
}: ScheduleWorkOrderParams) {
  try {
    // Get organization ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', technicianId)
      .single();

    if (!profile?.organization_id) {
      throw new Error('Organization not found');
    }

    // Calculate initial end time
    let endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + estimatedDurationMinutes);

    // Get work day end time
    const workDayEnd = await calculateWorkDayEndTime(profile.organization_id, startTime);
    
    // Check if job extends beyond work day
    if (endTime > workDayEnd) {
      // This will be a multi-day booking
      const minutesUntilDayEnd = Math.floor((workDayEnd.getTime() - startTime.getTime()) / 1000 / 60);
      const remainingMinutes = estimatedDurationMinutes - minutesUntilDayEnd;

      // Create first day's booking
      const firstDayEndTime = new Date(workDayEnd);
      await createBooking(
        workOrderId,
        technicianId,
        startTime,
        firstDayEndTime,
        profile.organization_id,
        minutesUntilDayEnd,
        true,
        undefined,
        1,
        remainingMinutes,
        estimatedDurationMinutes
      );

      // Get next working day
      const { data: nextDay } = await supabase.rpc('get_next_working_day', {
        p_organization_id: profile.organization_id,
        p_start_date: startTime.toISOString()
      });

      if (!nextDay) {
        throw new Error('Could not determine next working day');
      }

      // Create subsequent bookings until all hours are scheduled
      let currentDate = new Date(nextDay);
      let remainingMins = remainingMinutes;
      let sequence = 2;

      while (remainingMins > 0) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(9, 0, 0, 0); // Assuming 9 AM start
        
        const dayEnd = await calculateWorkDayEndTime(profile.organization_id, currentDate);
        const availableMinutes = Math.floor((dayEnd.getTime() - dayStart.getTime()) / 1000 / 60);
        
        const bookingDuration = Math.min(remainingMins, availableMinutes);
        const bookingEnd = new Date(dayStart);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + bookingDuration);

        await createBooking(
          workOrderId,
          technicianId,
          dayStart,
          bookingEnd,
          profile.organization_id,
          bookingDuration,
          true,
          undefined,
          sequence,
          remainingMins - bookingDuration,
          estimatedDurationMinutes
        );

        remainingMins -= bookingDuration;
        sequence++;

        // Get next working day if we still have hours to schedule
        if (remainingMins > 0) {
          const { data: nextWorkDay } = await supabase.rpc('get_next_working_day', {
            p_organization_id: profile.organization_id,
            p_start_date: currentDate.toISOString()
          });
          if (!nextWorkDay) throw new Error('Could not determine next working day');
          currentDate = new Date(nextWorkDay);
        }
      }
    } else {
      // Single day booking - use original logic
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

      await createBooking(
        workOrderId,
        technicianId,
        startTime,
        endTime,
        profile.organization_id,
        estimatedDurationMinutes,
        false
      );
    }

    // Update work order status
    const { error: workOrderError } = await supabase
      .from('customer_repair_jobs')
      .update({
        assigned_technician_id: technicianId,
        scheduling_status: 'scheduled',
        estimated_duration_minutes: estimatedDurationMinutes
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

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
