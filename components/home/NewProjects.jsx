"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../Reveal";
import ProjectCard from "../ProjectCard";
import Icon from "../Icon";
import { PROJECTS } from "@/lib/data";

// Horizontal parallax: the row of projects drifts sideways as you scroll past
export default function NewProjects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);

  return (
    <section ref={ref} className="section new-projects">
      <div className="container">
        <div className="section-head split">
          <Reveal>
            <span className="eyebrow eyebrow-light">New projects</span>
            <h2>
              Launches from <em className="hl">trusted builders</em>
            </h2>
            <p>Apartments, villas and plotted layouts with RERA registration.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/projects" className="btn btn-yellow">
              All projects <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
      <motion.div className="np-track" style={{ x }}>
        {PROJECTS.map((pr, i) => (
          <div key={pr.id} className="np-item">
            <ProjectCard pr={pr} index={i} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
