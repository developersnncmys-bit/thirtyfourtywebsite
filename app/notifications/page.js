import PageHero from "@/components/PageHero";
import NotificationsList from "@/components/NotificationsList";

export const metadata = { title: "Notifications", robots: { index: false } };

export default function NotificationsPage() {
  return (
    <>
      <PageHero eyebrow="Notifications" title="Notifications" text="New enquiries and updates from Thirty Forty." compact />
      <NotificationsList />
    </>
  );
}
