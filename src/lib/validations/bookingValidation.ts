
import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  vehicleInfo: z.string().min(2, "Vehicle information is required"),
  jobDescription: z.string().min(10, "Please provide a detailed job description"),
  assignedTechnicianId: z.string().optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]{10,}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
  estimatedCost: z.number().min(0, "Cost cannot be negative"),
  priority: z.enum(["low", "normal", "high"]),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
  }),
  start_time: z.date(),
  end_time: z.date(),
});

export type BookingValidationSchema = z.infer<typeof bookingSchema>;

export const validateBookingTime = (
  startTime: Date,
  endTime: Date,
  existingBookings: Array<{ start_time: string; end_time: string }>
): { isValid: boolean; error?: string } => {
  // Check if end time is after start time
  if (endTime <= startTime) {
    return {
      isValid: false,
      error: "End time must be after start time",
    };
  }

  // Check for conflicts with existing bookings
  const hasConflict = existingBookings.some((booking) => {
    const bookingStart = new Date(booking.start_time);
    const bookingEnd = new Date(booking.end_time);
    
    return (
      (startTime >= bookingStart && startTime < bookingEnd) ||
      (endTime > bookingStart && endTime <= bookingEnd) ||
      (startTime <= bookingStart && endTime >= bookingEnd)
    );
  });

  if (hasConflict) {
    return {
      isValid: false,
      error: "This time slot conflicts with an existing booking",
    };
  }

  return { isValid: true };
};
