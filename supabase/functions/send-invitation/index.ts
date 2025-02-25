
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationData {
  email: string;
  role: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function validateInvitation(data: InvitationData): ValidationResult {
  const errors: string[] = [];

  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!data.role || !['owner', 'management', 'service_advisor', 'technician', 'custom'].includes(data.role)) {
    errors.push('Valid role is required');
  }

  if (!data.organizationId || typeof data.organizationId !== 'string') {
    errors.push('Valid organization ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function createInvitationToken(email: string, organizationId: string, invitedBy: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_invitation_token', {
    target_email: email,
    organization_id: organizationId,
    invited_by: invitedBy
  });

  if (error) throw new Error(error.message);
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const invitedBy = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!invitedBy) {
      throw new Error('Authorization required');
    }

    const { email, role, organizationId, firstName, lastName }: InvitationData = await req.json();
    
    // Validate input
    const validation = validateInvitation({ email, role, organizationId, firstName, lastName });
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.errors 
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create invitation token
    const token = await createInvitationToken(email, organizationId, invitedBy);

    // Send invitation email
    const inviteUrl = `${Deno.env.get('PUBLIC_SITE_URL')}/join?token=${token}`;
    
    const emailResponse = await resend.emails.send({
      from: 'Auto Shop <onboarding@resend.dev>',
      to: [email],
      subject: 'Invitation to join Auto Shop',
      html: `
        <h1>You've been invited!</h1>
        <p>You've been invited to join as a ${role}.</p>
        ${firstName ? `<p>Hello ${firstName},</p>` : ''}
        <p>Click the link below to accept your invitation:</p>
        <a href="${inviteUrl}">Accept Invitation</a>
        <p>This invitation will expire in 24 hours.</p>
      `
    });

    // Log success
    console.log('Invitation sent successfully:', {
      email,
      role,
      organizationId,
      token: token.substring(0, 8) + '...'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Invitation sent successfully',
        data: emailResponse
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-invitation function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to send invitation',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})
