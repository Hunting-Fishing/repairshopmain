
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateWorkDayEndTime } from "./scheduling/businessHours";
import { createBooking, updateWorkOrderSchedule, unscheduleWorkOrder } from "./scheduling/bookingOperations";
import type { ScheduleWorkOrderParams } from "./scheduling/types";

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
      await createBooking({
        workOrderId,
        technicianId,
        startTime,
        endTime: firstDayEndTime,
        organizationId: profile.organization_id,
        estimatedDurationMinutes: minutesUntilDayEnd,
        isMultiDay: true,
        sequenceNumber: 1,
        remainingMinutes,
        totalDurationMinutes: estimatedDurationMinutes
      });

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

        await createBooking({
          workOrderId,
          technicianId,
          startTime: dayStart,
          endTime: bookingEnd,
          organizationId: profile.organization_id,
          estimatedDurationMinutes: bookingDuration,
          isMultiDay: true,
          sequenceNumber: sequence,
          remainingMinutes: remainingMins - bookingDuration,
          totalDurationMinutes: estimatedDurationMinutes
        });

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

      await createBooking({
        workOrderId,
        technicianId,
        startTime,
        endTime,
        organizationId: profile.organization_id,
        estimatedDurationMinutes,
        isMultiDay: false
      });
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

export { updateWorkOrderSchedule, unscheduleWorkOrder } from './scheduling/bookingOperations';
export { getBusinessHours, checkBusinessHours } from './scheduling/businessHours';
