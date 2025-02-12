
import { serve } from "https://deno.fresh.run/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Twilio } from "https://esm.sh/twilio@4.19.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendSMSBody {
  to: string;
  content: string;
  customerId?: string;
  templateId?: string;
  metadata?: Record<string, any>;
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

    const { to, content, customerId, templateId, metadata } = await req.json() as SendSMSBody;

    // Initialize Twilio client
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio configuration');
    }

    const client = new Twilio(accountSid, authToken);

    // Send SMS using Twilio
    console.log(`Sending SMS to ${to} from ${fromNumber}`);
    const message = await client.messages.create({
      body: content,
      to,
      from: fromNumber,
    });

    console.log('SMS sent successfully:', message.sid);

    // Record the SMS in the database
    const { data: smsRecord, error: insertError } = await supabaseClient
      .from('sms_messages')
      .insert({
        organization_id: profile.organization_id,
        customer_id: customerId,
        template_id: templateId,
        phone_number: to,
        content,
        status: 'sent',
        sent_at: new Date().toISOString(),
        twilio_message_sid: message.sid,
        metadata,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error recording SMS:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'SMS sent successfully', data: smsRecord }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending SMS:', error);
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
