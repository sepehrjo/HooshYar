import { NextResponse, type NextRequest } from "next/server";
import {
  validateContactSubmission,
  type ContactValidationInput,
} from "@/lib/contact-validation";
import { saveLead } from "@/lib/kv";

export async function POST(request: NextRequest) {
  let payload: ContactValidationInput;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateContactSubmission(payload);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  const { name, companyName, email, phone, service, message, locale } = validation.data;

  try {
    await saveLead({ name, companyName, email, phone, service, message, locale, status: "new" });
  } catch (error) {
    console.error("Failed to save lead to KV:", error);
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "Hoosh Yar <onboarding@resend.dev>";

  if (!resendKey || !toEmail) {
    return NextResponse.json({
      ok: true,
      mode: "placeholder",
      note: "Contact request validated. Configure RESEND_API_KEY and CONTACT_TO_EMAIL to enable real email delivery.",
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email || undefined,
      subject: `Hoosh Yar inquiry: ${service}`,
      text: `Locale: ${locale}\nName: ${name}\nCompany: ${companyName}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Email provider failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, mode: "email" });
}
