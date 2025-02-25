
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { customerId, rewardId } = await req.json()

    // Get customer and reward details
    const { data: customer } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single()

    const { data: reward } = await supabaseClient
      .from('loyalty_rewards')
      .select('*')
      .eq('id', rewardId)
      .single()

    if (!customer || !reward) {
      throw new Error('Customer or reward not found')
    }

    if (customer.loyalty_points < reward.points_cost) {
      throw new Error('Insufficient points')
    }

    // Start transaction
    const { error: redeemError } = await supabaseClient.rpc('redeem_loyalty_reward', {
      p_customer_id: customerId,
      p_reward_id: rewardId,
      p_points_cost: reward.points_cost
    })

    if (redeemError) throw redeemError

    // Send email notification
    await resend.emails.send({
      from: 'rewards@yourdomain.com',
      to: customer.email,
      subject: 'Your Reward Has Been Redeemed!',
      html: `
        <h1>Congratulations!</h1>
        <p>You have successfully redeemed: ${reward.name}</p>
        <p>Points used: ${reward.points_cost}</p>
        <p>Remaining balance: ${customer.loyalty_points - reward.points_cost}</p>
      `
    })

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
