
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the request body
    const { email, password, userData, organizationId } = await req.json()

    // Validate the request
    if (!email || !organizationId) {
      return new Response(
        JSON.stringify({ error: 'Email and organizationId are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate a random password if none provided
    const finalPassword = password || Math.random().toString(36).slice(-8)

    // Create the user
    const { data: authData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email,
      password: finalPassword,
      email_confirm: true,
      user_metadata: userData
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError)
      throw createUserError
    }

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        organization_id: organizationId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        custom_role_id: userData.role === 'custom' ? userData.customRoleId : null,
        phone_number: userData.phoneNumber,
        hire_date: userData.hireDate ? userData.hireDate : null,
        notes: userData.notes,
        schedule: userData.schedule,
        status: 'active'
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      throw profileError
    }

    // Add organization membership
    const { error: membershipError } = await supabaseClient
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: authData.user.id,
        status: 'active'
      })

    if (membershipError) {
      console.error('Error creating organization membership:', membershipError)
      throw membershipError
    }

    return new Response(
      JSON.stringify({ 
        user: authData.user,
        password: finalPassword 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-staff-member function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
