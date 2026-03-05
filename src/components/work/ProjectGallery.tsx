"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { ProjectPhase } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGallery({ phases }: { phases: ProjectPhase[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const sorted = [...phases].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const items = galleryRef.current?.querySelectorAll(".phase-item");
    items?.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        }
      );
    });
  }, [phases]);

  return (
    <>
      <div ref={galleryRef} className="space-y-32">
        {sorted.map((phase, i) => (
          <div
            key={phase.id}
            className={`phase-item flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
          >
            {/* Image */}
            <div
              className="flex-1 relative overflow-hidden cursor-none group"
              style={{ aspectRatio: "16/10" }}
              onClick={() => setLightbox(phase.imageUrl)}
              data-cursor
            >
              {phase.imageUrl ? (
                <Image
                  src={phase.imageUrl}
                  alt={phase.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-forest-800" />
              )}
              <div className="absolute inset-0 border border-forest-800 group-hover:border-forest-500 transition-colors" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="nav-link text-cream/60 text-xs">EXPAND</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 max-w-sm">
              <p className="nav-link text-forest-500 mb-4">
                PHASE {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-3xl text-cream font-light mb-4">
                {phase.title}
              </h3>
              <div className="line-nature w-16 mb-6" />
              <p className="text-cream/60 font-light leading-relaxed">
                {phase.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center p-8 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[85vh] aspect-video">
            <Image src={lightbox} alt="Phase detail" fill style={{ objectFit: "contain" }} />
          </div>
          <button
            className="absolute top-8 right-8 nav-link text-forest-400 hover:text-cream"
            onClick={() => setLightbox(null)}
          >
            CLOSE ✕
          </button>
        </div>
      )}
    </>
  );
}