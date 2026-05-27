/**
 * Placeholder integrations for SMS (Twilio) and WhatsApp Business API.
 * Both are no-ops unless the relevant env vars are present.
 */

export async function sendSms(to: string, body: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.warn("[notify] Twilio not configured — skipping SMS to", to);
    return { skipped: true };
  }
  // To activate: install `twilio` package and use it here. We do not add it
  // by default to keep the deploy bundle small for users who don't need SMS.
  console.info("[notify] Would send SMS via Twilio:", { to, body });
  return { skipped: false };
}

export async function sendWhatsApp(to: string, body: string) {
  const { WHATSAPP_API_URL, WHATSAPP_API_TOKEN } = process.env;
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
    console.warn("[notify] WhatsApp API not configured — skipping message to", to);
    return { skipped: true };
  }
  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
    return { skipped: false, ok: res.ok };
  } catch (err) {
    console.error("[notify] WhatsApp send failed:", err);
    return { skipped: false, ok: false };
  }
}
