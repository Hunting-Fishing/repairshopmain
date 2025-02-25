
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  token: string;
  type: "password_reset" | "email_verification";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, type }: EmailRequest = await req.json();
    const baseUrl = req.headers.get("origin") || "";
    
    let subject: string;
    let actionUrl: string;
    let actionText: string;
    
    if (type === "password_reset") {
      subject = "Reset Your Password";
      actionUrl = `${baseUrl}/auth/set-password?token=${token}`;
      actionText = "Reset Password";
    } else {
      subject = "Verify Your Email";
      actionUrl = `${baseUrl}/auth/verify-email?token=${token}`;
      actionText = "Verify Email";
    }

    const emailResponse = await resend.emails.send({
      from: "Auth <onboarding@resend.dev>",
      to: [email],
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>${subject}</h1>
          <p>Click the button below to ${type === "password_reset" ? "reset your password" : "verify your email"}:</p>
          <a href="${actionUrl}" style="display: inline-block; padding: 12px 20px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            ${actionText}
          </a>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${actionUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
