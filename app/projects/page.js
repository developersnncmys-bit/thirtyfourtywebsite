import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ProjectsList from "@/components/ProjectsList";

export const metadata = {
  title: "New projects in Mysuru",
  description: "New launch, under-construction and ready-to-move projects in Mysuru, direct from builders. Zero brokerage.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="New projects" title="New projects in Mysuru" text="Apartments, villas and plotted layouts — direct from builders, no brokerage." />
      <Suspense fallback={<div className="container section">Loading…</div>}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
