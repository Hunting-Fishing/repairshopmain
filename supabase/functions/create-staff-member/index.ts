
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

    let authData;

    // Check if user exists using listUsers and filtering
    const { data: users, error: getUserError } = await supabaseClient.auth.admin.listUsers()
    const existingUser = users?.users.find(user => user.email === email)
    
    if (getUserError) {
      console.error('Error checking for existing user:', getUserError)
      throw getUserError
    }

    const invitationToken = crypto.randomUUID();
    const temporaryPassword = Math.random().toString(36).slice(-12);

    if (existingUser) {
      authData = { user: existingUser }
      console.log('User already exists:', existingUser.id)
    } else {
      // Create the user with the temporary password
      const { data: newAuthData, error: createUserError } = await supabaseClient.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: userData
      })

      if (createUserError) {
        console.error('Error creating user:', createUserError)
        throw createUserError
      }

      authData = newAuthData
      console.log('New user created:', authData.user.id)
    }

    // Upsert profile with invitation token
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
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
        status: 'active',
        invitation_token: invitationToken,
        invitation_sent_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (profileError) {
      console.error('Error upserting profile:', profileError)
      throw profileError
    }

    // Upsert organization membership
    const { error: membershipError } = await supabaseClient
      .from('organization_members')
      .upsert({
        organization_id: organizationId,
        user_id: authData.user.id,
        status: 'active'
      }, {
        onConflict: 'user_id,organization_id',
        ignoreDuplicates: false
      })

    if (membershipError) {
      console.error('Error upserting organization membership:', membershipError)
      throw membershipError
    }

    // Send invitation email
    try {
      const client = new SmtpClient();
      await client.connectTLS({
        hostname: Deno.env.get('SMTP_HOSTNAME') || '',
        port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
        username: Deno.env.get('SMTP_USERNAME') || '',
        password: Deno.env.get('SMTP_PASSWORD') || '',
      });

      const inviteUrl = `${Deno.env.get('APP_URL')}/auth/set-password?token=${invitationToken}`;
      
      await client.send({
        from: Deno.env.get('SMTP_FROM') || '',
        to: email,
        subject: "You've been invited to join the team",
        content: `
          Hello ${userData.firstName},

          You've been invited to join the team. To get started, please set your password by clicking the link below:

          ${inviteUrl}

          This link will expire in 7 days.

          If you didn't expect this invitation, please ignore this email.
        `,
      });

      await client.close();
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't throw here - we still want to return the user data even if email fails
    }

    return new Response(
      JSON.stringify({ 
        user: authData.user,
        invitationSent: true
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
