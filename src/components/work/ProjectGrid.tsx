"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gridRef.current?.querySelectorAll(".project-card").forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
          delay: (i % 3) * 0.1,
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" } }
      );
    });
  }, [projects]);

  if (!projects.length) return (
    <div className="py-32 text-center">
      <p className="font-mono text-[11px] tracking-widest" style={{ color: "#3a4a3a" }}>
        AUCUN PROJET — AJOUTER VIA /ADMINHUGO
      </p>
    </div>
  );

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
      style={{ background: "rgba(177,182,149,0.06)" }}>
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
}