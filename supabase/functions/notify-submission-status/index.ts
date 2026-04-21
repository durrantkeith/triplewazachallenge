import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotifyRequest {
  email: string;
  status: "approved" | "rejected";
  country?: string;
  level?: number;
  dojo_name?: string;
  admin_notes?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function verifyAdmin(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) return false;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return false;

  return user.app_metadata?.is_admin === true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, status, country, level, dojo_name, admin_notes }: NotifyRequest = await req.json();

    if (!email || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email and status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isApproved = status === "approved";

    const subjectLine = isApproved
      ? "Your Triple Waza Challenge submission has been approved!"
      : "Update on your Triple Waza Challenge submission";

    const statusBadge = isApproved
      ? `<div style="background: #dcfce7; border: 1px solid #16a34a; color: #15803d; padding: 10px 20px; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Approved</div>`
      : `<div style="background: #fee2e2; border: 1px solid #dc2626; color: #b91c1c; padding: 10px 20px; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Not Approved</div>`;

    const approvedContent = `
      <p>Congratulations! Your submission has been reviewed and <strong>approved</strong> by our team. Your video will now appear in the Hall of Fame for the global judo community to see.</p>
      <p>Thank you for being part of this global celebration of Nage no Kata. Your participation helps inspire dojos around the world.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://triplewazachallenge.com" style="background: #1e3a5f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">View the Hall of Fame</a>
      </div>
    `;

    const safeNotes = admin_notes ? escapeHtml(admin_notes) : null;

    const rejectedContent = `
      <p>Thank you for submitting to the Triple Waza Challenge. Unfortunately, your submission was not approved at this time.</p>
      ${safeNotes ? `<div style="background: #f0f4f8; padding: 15px; border-left: 4px solid #1e3a5f; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Feedback from our team:</strong></p>
        <p style="margin: 10px 0 0 0; color: #374151;">${safeNotes}</p>
      </div>` : ''}
      <p>You're welcome to review the submission guidelines and resubmit when you're ready.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://triplewazachallenge.com" style="background: #1e3a5f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">Submit Again</a>
      </div>
    `;

    const safeDojo = dojo_name ? escapeHtml(dojo_name) : null;
    const safeCountry = country ? escapeHtml(country) : null;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #1e3a5f; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Triple Waza Challenge</h1>
          <p style="color: #93c5fd; margin: 8px 0 0 0; font-size: 14px;">Nage no Kata Global Challenge</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Submission Update</h2>
          ${safeDojo ? `<p style="color: #6b7280; margin-bottom: 20px;">Dojo: <strong>${safeDojo}</strong>${safeCountry ? ` &mdash; ${safeCountry}` : ''}${level ? ` &mdash; Level ${Number(level)}` : ''}</p>` : ''}
          <div style="text-align: center; margin: 20px 0;">
            ${statusBadge}
          </div>
          ${isApproved ? approvedContent : rejectedContent}
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Triple Waza Challenge &mdash; Uniting the Global Judo Community</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;"><a href="https://triplewazachallenge.com" style="color: #6b7280;">triplewazachallenge.com</a></p>
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Triple Waza Challenge <noreply@triplewazachallenge.com>",
        to: [email],
        subject: subjectLine,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
