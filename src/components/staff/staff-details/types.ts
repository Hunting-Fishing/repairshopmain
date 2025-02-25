
import { z } from "zod";
import { staffDetailsSchema } from "./schema";

export type StaffDetailsFormValues = z.infer<typeof staffDetailsSchema>;

export interface StaffMemberData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  notes: string | null;
  emergency_contact: {
    name?: string;
    phone?: string;
    relationship?: string;
  } | null;
  skills: string[];
}

export interface StaffDetailsFormProps {
  staffMember: StaffMemberData;
  onClose: () => void;
}
