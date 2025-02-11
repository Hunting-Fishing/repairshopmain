
import { BusinessHours } from "@/types/bookings";

export interface ScheduleWorkOrderParams {
  workOrderId: string;
  technicianId: string;
  startTime: Date;
  estimatedDurationMinutes: number;
}

export interface CreateBookingParams {
  workOrderId: string;
  technicianId: string;
  startTime: Date;
  endTime: Date;
  organizationId: string;
  estimatedDurationMinutes: number;
  isMultiDay?: boolean;
  parentBookingId?: string;
  sequenceNumber?: number;
  remainingMinutes?: number;
  totalDurationMinutes?: number;
}
