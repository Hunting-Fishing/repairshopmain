import { z } from "zod";

export const staffMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["technician", "service_advisor", "management", "parts", "hr", "custom"]),
  customRoleId: z.string().optional(),
});

export type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;