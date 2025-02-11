
import { supabase } from "@/integrations/supabase/client";
import { BusinessHours } from "@/types/bookings";

export async function calculateWorkDayEndTime(organizationId: string, date: Date): Promise<Date> {
  const { data: settings } = await supabase
    .from('calendar_settings')
    .select('business_hours')
    .eq('organization_id', organizationId)
    .single();

  if (!settings?.business_hours) {
    throw new Error('Business hours not configured');
  }

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayHours = settings.business_hours[dayName];
  
  if (!dayHours) {
    throw new Error('No business hours set for this day');
  }

  const endTime = new Date(date);
  const [hours, minutes] = dayHours.end.split(':');
  endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return endTime;
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
