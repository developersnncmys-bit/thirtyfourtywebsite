import PageHero from "@/components/PageHero";
import MyEnquiries from "@/components/MyEnquiries";

export const metadata = { title: "My Enquiries", robots: { index: false } };

export default function EnquiriesPage() {
  return (
    <>
      <PageHero eyebrow="Enquiries" title="My Enquiries" text="Properties you have enquired about." compact />
      <MyEnquiries />
    </>
  );
}
