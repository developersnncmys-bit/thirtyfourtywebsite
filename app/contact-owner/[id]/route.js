import { NextResponse } from "next/server";
import { getListing, getOwnerPhone } from "@/lib/listings";
import { SITE, whatsappLink } from "@/lib/site";

// "Enquire Now" and the call button, like the app. The owner's number is
// looked up here on the server, so it is never part of the page itself.
export async function GET(req, { params }) {
  const { id } = await params;
  const url = new URL(req.url);
  const via = url.searchParams.get("via") === "call" ? "call" : "whatsapp";
  const name = (url.searchParams.get("name") || "").slice(0, 60).trim();
  const phone = (url.searchParams.get("phone") || "").replace(/[^\d+ ]/g, "").slice(0, 16).trim();

  const [p, owner] = await Promise.all([getListing(id), getOwnerPhone(id)]);
  if (!p) return NextResponse.redirect(new URL("/properties", req.url));

  if (via === "call") return NextResponse.redirect(`tel:+${owner || SITE.phoneRaw}`);

  // Same wording as the app's enquiry message
  const link = `${SITE.url}/property/${p.id}`;
  const text = owner
    ? `Hi ${p.owner}, I'm ${name || "interested"}. I'm interested in your ${p.title} listed on Thirty Forty.${phone ? ` You can reach me at ${phone}.` : ""}\n${link}`
    : `Hi Thirty Forty, I'm ${name || "interested"} and would like to enquire about "${p.title}".${phone ? ` You can reach me at ${phone}.` : ""}\n${link}`;
  return NextResponse.redirect(whatsappLink(text, owner || SITE.phoneRaw));
}
