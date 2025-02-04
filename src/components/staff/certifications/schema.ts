import { z } from "zod";

export const certificationFormSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.date().optional(),
  expiry_date: z.date().optional(),
  notes: z.string().optional(),
  certification_type: z.enum([
    "Professional",
    "Safety",
    "Technical",
    "Regulatory",
    "Other"
  ]).optional(),
});

export type CertificationFormValues = z.infer<typeof certificationFormSchema>;