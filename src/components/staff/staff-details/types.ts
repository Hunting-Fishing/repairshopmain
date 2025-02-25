
import { z } from "zod";
import { staffDetailsSchema, EmergencyContact } from "./schema";

// This type represents the form values
export type StaffDetailsFormValues = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  notes: string | null;
  emergency_contact: EmergencyContact;
  skills: string[];
};

// This type represents the data structure required by the API
export interface StaffMemberData extends StaffDetailsFormValues {
  id: string;
}

export interface StaffDetailsFormProps {
  staffMember: StaffMemberData;
  onClose: () => void;
}
