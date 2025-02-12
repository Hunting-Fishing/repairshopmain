
export interface SendEmailFormData {
  to: string;
  subject: string;
  content: string;
}

export interface EmailDialogProps {
  customerId: string;
  customerEmail?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
