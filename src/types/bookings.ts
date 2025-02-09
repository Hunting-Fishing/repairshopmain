
export interface BookingFormValues {
  customerName: string;
  vehicleInfo: string;
  jobDescription: string;
  assignedTechnicianId: string;
  phoneNumber: string;
  email: string;
  notes: string;
  estimatedCost: number;
  priority: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
}

export interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeSlot: { start: Date; end: Date } | null;
  onBookingCreated: () => void;
}
