"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ForestParallax() {
  const bgRef     = useRef<HTMLDivElement>(null);
  const midRef    = useRef<HTMLDivElement>(null);
  const fgRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Layer 1 — background forest (slow)
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true },
    });
    // Layer 2 — mid trees
    gsap.to(midRef.current, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true },
    });
    // Layer 3 — foreground trees (fast)
    gsap.to(fgRef.current, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* BG photo */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <Image
          src="/images/forest-bg.jpg"
          alt="Forest background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          quality={90}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-forest-950/60" />
      </div>

      {/* Mid SVG trees layer */}
      <div ref={midRef} className="absolute inset-0 scale-110">
        <TreesSVG opacity={0.6} scale={1.1} />
      </div>

      {/* Foreground SVG trees layer */}
      <div ref={fgRef} className="absolute bottom-0 w-full">
        <TreesSVG opacity={0.9} scale={1.3} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-forest-950 to-transparent" />
    </div>
  );
}

function TreesSVG({ opacity, scale }: { opacity: number; scale: number }) {
  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 w-full"
      style={{ opacity, transform: `scaleY(${scale})`, transformOrigin: "bottom" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified pine silhouettes */}
      {[80,180,280,380,480,560,640,720,800,880,960,1040,1120,1200,1280,1360].map((x, i) => {
        const h   = 200 + ((i * 37) % 120);
        const w   = 40  + ((i * 13) % 30);
        return (
          <g key={i} transform={`translate(${x}, ${400 - h})`}>
            <polygon
              points={`${w/2},0 ${w},${h*0.4} ${w*0.8},${h*0.4} ${w},${h*0.65} ${w*0.75},${h*0.65} ${w},${h} 0,${h} ${w*0.25},${h*0.65} 0,${h*0.65} ${w*0.2},${h*0.4} 0,${h*0.4}`}
              fill="#051a08"
              stroke="#0a2e10"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
}