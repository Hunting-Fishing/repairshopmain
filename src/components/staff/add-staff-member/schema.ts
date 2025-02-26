
import { z } from "zod";

export const staffMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().optional(),
  role: z.string(),
  customRoleId: z.string().optional(),
  hireDate: z.date().optional(),
  notes: z.string().optional(),
});

export type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;
