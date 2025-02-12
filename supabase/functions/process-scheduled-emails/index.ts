
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get all pending scheduled emails that need to be sent
  const { data: scheduledEmails, error: fetchError } = await supabaseAdmin
    .from('scheduled_communications')
    .select('*')
    .eq('status', 'pending')
    .eq('type', 'email')
    .lte('scheduled_for', new Date().toISOString())

  if (fetchError) {
    console.error('Error fetching scheduled emails:', fetchError)
    return new Response(JSON.stringify({ error: fetchError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }

  const results = []
  
  for (const email of scheduledEmails || []) {
    try {
      // Send the email using the send-email function
      const { data, error } = await supabaseClient.functions.invoke('send-email', {
        body: {
          to: email.to,
          subject: email.subject,
          content: email.content,
          customerId: email.customer_id
        }
      })

      if (error) throw error

      // Update the scheduled communication status
      const { error: updateError } = await supabaseAdmin
        .from('scheduled_communications')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', email.id)

      if (updateError) throw updateError

      results.push({
        id: email.id,
        status: 'success'
      })

    } catch (error) {
      console.error(`Error processing scheduled email ${email.id}:`, error)
      
      // Update the status to failed
      await supabaseAdmin
        .from('scheduled_communications')
        .update({ 
          status: 'failed',
          error_message: error.message
        })
        .eq('id', email.id)

      results.push({
        id: email.id,
        status: 'error',
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ processed: results.length, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
