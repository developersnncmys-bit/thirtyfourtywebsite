import PageHero from "@/components/PageHero";
import AccountView from "@/components/AccountView";

export const metadata = { title: "My Profile", robots: { index: false } };

export default function AccountPage() {
  return (
    <>
      <PageHero eyebrow="Profile" title="My Profile" text="Your account — the same one you use in the Thirty Forty app." compact />
      <AccountView />
    </>
  );
}
