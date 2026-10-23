import PageHero from "@/components/PageHero";
import Dashboard from "@/components/Dashboard";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default function DashboardPage() {
  return (
    <>
      <PageHero eyebrow="Dashboard" title="My Property List" text="Your listings and everyone who enquired about them." compact />
      <Dashboard />
    </>
  );
}
