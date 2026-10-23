import PolicyPage from "@/components/PolicyPage";
import doc from "@/lib/policies/privacy.json";

export const metadata = { title: "Privacy Policy", description: doc.subtitle };

export default function PrivacyPage() {
  return <PolicyPage doc={doc} eyebrow="Privacy Policy" current="/privacy-policy" />;
}
