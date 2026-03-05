"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project } from "@/types";

const C = { bg: "#1C2B28", card: "#2E4440", sage: "#B1B695", brown: "#7D451B", text: "#EDE8DF", muted: "#5A6B52" };

export default function ProjectCard({ project }: { project: Project }) {
  const imgRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef   = useRef<HTMLDivElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.to(imgRef.current,    { scale: 1.05, duration: 0.8, ease: "power2.out" });
    gsap.to(overlayRef.current,{ opacity: 1,  duration: 0.4 });
    gsap.to(infoRef.current,   { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(numRef.current,    { opacity: 1,  duration: 0.3 });
  };
  const onLeave = () => {
    gsap.to(imgRef.current,    { scale: 1,   duration: 0.8, ease: "power2.out" });
    gsap.to(overlayRef.current,{ opacity: 0, duration: 0.4 });
    gsap.to(infoRef.current,   { y: 16, opacity: 0, duration: 0.3 });
    gsap.to(numRef.current,    { opacity: 0, duration: 0.2 });
  };

  return (
    <div className="project-card relative overflow-hidden" style={{ aspectRatio: "4/5", background: C.card }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link href={`/work/${project.slug}`} className="block w-full h-full">

        {/* Image */}
        <div ref={imgRef} className="w-full h-full">
          {project.coverImage
            ? <Image src={project.coverImage} alt={project.title} fill style={{ objectFit: "cover" }} sizes="33vw"/>
            : <div className="w-full h-full flex items-center justify-center"
                style={{ background: "#243330" }}>
                <span className="font-mono text-[10px] tracking-widest" style={{ color: "#3a4a3a" }}>NO IMAGE</span>
              </div>
          }
        </div>

        {/* Overlay gradient */}
        <div ref={overlayRef} className="absolute inset-0 opacity-0"
          style={{ background: "linear-gradient(180deg, transparent 20%, rgba(28,43,40,0.95) 100%)" }} />

        {/* Numéro haut droit */}
        <span ref={numRef} className="absolute top-5 right-5 font-mono text-[10px] tracking-widest opacity-0"
          style={{ color: C.sage }}>
          {String(project.phases?.length ?? 0).padStart(2,"0")} PHASES
        </span>

        {/* Info bas */}
        <div ref={infoRef} className="absolute bottom-0 left-0 right-0 p-7 opacity-0"
          style={{ transform: "translateY(16px)" }}>
          <p className="font-mono text-[10px] tracking-widest mb-2" style={{ color: C.brown }}>
            {project.category} · {project.year}
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "1.7rem", color: C.text, lineHeight: 1 }}>
            {project.title}
          </h3>
          <div className="flex gap-2 mt-4 flex-wrap">
            {project.tags?.slice(0,3).map(t => (
              <span key={t} className="font-mono text-[9px] tracking-wider px-2 py-1"
                style={{ color: C.sage, border: `1px solid ${C.sage}30` }}>{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}