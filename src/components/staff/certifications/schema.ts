import { z } from "zod";

export const certificationFormSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional(),
  issue_date: z.date().optional(),
  expiry_date: z.date().optional(),
});

export type CertificationFormValues = z.infer<typeof certificationFormSchema>;