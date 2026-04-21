import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConfirmationRequest {
  email: string;
  dojo_name: string;
  city: string;
  country: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, dojo_name, city, country }: ConfirmationRequest = await req.json();

    if (!email || !dojo_name || !country) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
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

    const safeDojoName = escapeHtml(dojo_name.slice(0, 300));
    const safeCity = city ? escapeHtml(city.slice(0, 200)) : "";
    const safeCountry = escapeHtml(country.slice(0, 200));
    const location = safeCity ? `${safeCity}, ${safeCountry}` : safeCountry;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #1e3a5f; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Triple Waza Challenge</h1>
          <p style="color: #93c5fd; margin: 8px 0 0 0; font-size: 14px;">Nage no Kata Global Challenge</p>
        </div>
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #dcfce7; border: 1px solid #16a34a; color: #15803d; padding: 12px 24px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">
              Submission Received!
            </div>
          </div>

          <h2 style="color: #1e3a5f; margin-top: 0;">Thank you, ${safeDojoName}!</h2>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We've received your video submission from <strong>${location}</strong>. Your dojo is now part of the global Triple Waza Challenge archive.
          </p>

          <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #1e3a5f; border-radius: 4px; margin: 24px 0;">
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
              <strong>What happens next?</strong><br/>
              Our team will review your video and add it to the Hall of Fame. You'll receive another email once your submission has been approved.
            </p>
          </div>

          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Thank you for helping preserve and celebrate Judo's rich tradition of kata practice. Together, we're building a living record of global Judo cooperation.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="https://triplewazachallenge.com" style="background: #1e3a5f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">
              View the Hall of Fame
            </a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Triple Waza Challenge &mdash; Uniting the Global Judo Community</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">
            <a href="https://triplewazachallenge.com" style="color: #6b7280;">triplewazachallenge.com</a>
          </p>
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
        subject: `Submission received — ${safeDojoName}`,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", detail: errorData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
