
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailBody {
  to: string;
  subject: string;
  content: string;
  customerId?: string;
  templateId?: string;
  metadata?: Record<string, any>;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader?.split(' ')[1] ?? ''
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get organization_id for the user
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      throw new Error('Organization not found');
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const { to, subject, content, customerId, templateId, metadata, cc, bcc, replyTo } = await req.json() as SendEmailBody;

    // Send email using Resend
    console.log(`Sending email to ${to}`);
    const emailResponse = await resend.emails.send({
      from: 'notifications@yourdomain.com', // Replace with your verified domain
      to,
      subject,
      html: content,
      ...(cc && { cc }),
      ...(bcc && { bcc }),
      ...(replyTo && { reply_to: replyTo }),
    });

    console.log('Email sent successfully:', emailResponse);

    // Record the email in the unified communications table
    const { data: emailRecord, error: insertError } = await supabaseClient
      .from('unified_communications')
      .insert({
        organization_id: profile.organization_id,
        customer_id: customerId,
        type: 'email',
        content,
        status: 'delivered',
        sent_at: new Date().toISOString(),
        metadata: {
          ...metadata,
          subject,
          email_id: emailResponse.id,
          cc,
          bcc,
          reply_to: replyTo
        },
        sender_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error recording email:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', data: emailRecord }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
