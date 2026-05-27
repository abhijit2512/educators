import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  const s = await getSiteSettings();
  // Public subset only
  return NextResponse.json({
    business_name: s.business_name,
    business_email: s.business_email,
    business_phone: s.business_phone,
    business_whatsapp: s.business_whatsapp,
    business_facebook: s.business_facebook,
    business_address: s.business_address,
    logo_url: s.logo_url,
    integrity_disclaimer: s.integrity_disclaimer,
  });
}
