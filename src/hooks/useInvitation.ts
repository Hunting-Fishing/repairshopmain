
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const invitationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  message: z.string().max(200, "Message must be 200 characters or less"),
});

export type InvitationData = z.infer<typeof invitationSchema>;

interface UseInvitationReturn {
  sendInvitation: (data: InvitationData) => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
}

export function useInvitation(): UseInvitationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateData = (data: InvitationData): z.ZodIssue[] => {
    try {
      invitationSchema.parse(data);
      return [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors;
      }
      return [{
        code: "custom",
        path: ["form"],
        message: "Validation failed",
        fatal: true
      }];
    }
  };

  const sendInvitation = async (data: InvitationData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate the input data
      const validationErrors = validateData(data);
      
      if (validationErrors.length > 0) {
        const newErrors: Record<string, string> = {};
        // Explicitly type the array and use proper forEach typing
        (validationErrors as z.ZodIssue[]).forEach(error => {
          const fieldName = String(error.path[0] || 'form');
          newErrors[fieldName] = error.message;
        });
        setErrors(newErrors);
        return;
      }

      // Get organization ID from user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (!profile?.organization_id) {
        throw new Error('Organization ID not found');
      }

      // Send invitation using edge function
      const { error: inviteError } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: data.email,
          role: 'custom', // Default to custom role
          organizationId: profile.organization_id,
          firstName: data.name,
          message: data.message
        }
      });

      if (inviteError) throw inviteError;

      toast.success('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendInvitation, isLoading, errors };
}
