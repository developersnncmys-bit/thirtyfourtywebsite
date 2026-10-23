import PolicyPage from "@/components/PolicyPage";
import doc from "@/lib/policies/refund.json";

export const metadata = { title: "Refund Policy", description: doc.subtitle };

export default function RefundPage() {
  return <PolicyPage doc={doc} eyebrow="Refund Policy" current="/refund-policy" />;
}
