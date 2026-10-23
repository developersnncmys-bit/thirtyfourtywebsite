import PolicyPage from "@/components/PolicyPage";
import doc from "@/lib/policies/terms.json";

export const metadata = { title: "Terms & Conditions", description: doc.subtitle };

export default function TermsPage() {
  return <PolicyPage doc={doc} eyebrow="Terms & Conditions" current="/terms-and-conditions" />;
}
