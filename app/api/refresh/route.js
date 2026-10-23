import { revalidateTag } from "next/cache";
import { LISTINGS_TAG } from "@/lib/listings";

// Called after a property is posted, edited or deleted so the website shows
// the change right away instead of after its 2-minute refresh
export async function POST() {
  revalidateTag(LISTINGS_TAG);
  return Response.json({ ok: true });
}
