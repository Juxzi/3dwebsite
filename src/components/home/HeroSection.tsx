"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function HeroSection() {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 }); // after loader
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.8, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }
    )
    .fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "power2.inOut" }, "-=0.6"
    )
    .fromTo(titleRef.current?.querySelectorAll(".char") ?? [],
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "power3.out" }, "-=0.4"
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4"
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3"
    );
  }, []);

  const titleChars = "BAO".split("").map((c, i) => (
    <span key={i} className="char inline-block">{c}</span>
  ));

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
      {/* Deer logo SVG */}
      <div ref={logoRef} className="mb-8 opacity-0">
        <DeerLogo />
      </div>

      {/* Decorative line */}
      <div
        ref={lineRef}
        className="line-nature w-32 mb-8 origin-left"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Title */}
      <h1 ref={titleRef} className="text-display text-cream mb-2 overflow-hidden">
        {titleChars}
      </h1>
      <h2 className="font-display text-2xl md:text-4xl text-forest-300 font-light italic mb-2">
        Digital Design
      </h2>

      <p ref={subRef} className="nav-link text-forest-300 mb-12 opacity-0 tracking-[0.4em]">
        3D SURFACE MODELLING · RENDERING · ANIMATION
      </p>

      <div ref={ctaRef} className="flex gap-8 opacity-0">
        <Link
          href="/work"
          className="nav-link border border-forest-600 px-8 py-3 hover:bg-forest-800 hover:border-forest-400 transition-all duration-500 hover:text-cream"
        >
          View Work
        </Link>
        <Link
          href="/about"
          className="nav-link px-8 py-3 text-forest-300 hover:text-cream transition-colors duration-300"
        >
          About Me
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="nav-link text-forest-400" style={{ fontSize: "0.6rem" }}>SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-forest-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

/* Inline deer SVG logo (cerf en lignes géométriques) */
function DeerLogo() {
  return (
    <svg
      width="100" height="120"
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-cream"
    >
      {/* Simplified geometric deer in lines */}
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body */}
        <polygon points="30,75 70,75 65,95 35,95" fill="none"/>
        {/* Neck */}
        <line x1="45" y1="75" x2="42" y2="58"/>
        <line x1="55" y1="75" x2="54" y2="58"/>
        {/* Head */}
        <polygon points="38,58 56,58 54,46 40,46" fill="none"/>
        {/* Eye */}
        <circle cx="48" cy="52" r="1.5" fill="currentColor"/>
        {/* Antler left */}
        <line x1="42" y1="46" x2="30" y2="30"/>
        <line x1="30" y1="30" x2="20" y2="20"/>
        <line x1="30" y1="30" x2="25" y2="18"/>
        <line x1="20" y1="20" x2="14" y2="12"/>
        <line x1="20" y1="20" x2="16" y2="10"/>
        {/* Antler right */}
        <line x1="52" y1="46" x2="64" y2="30"/>
        <line x1="64" y1="30" x2="76" y2="20"/>
        <line x1="64" y1="30" x2="70" y2="18"/>
        <line x1="76" y1="20" x2="82" y2="12"/>
        <line x1="76" y1="20" x2="80" y2="10"/>
        {/* Legs */}
        <line x1="38" y1="95" x2="35" y2="115"/>
        <line x1="45" y1="95" x2="43" y2="115"/>
        <line x1="55" y1="95" x2="57" y2="115"/>
        <line x1="62" y1="95" x2="65" y2="115"/>
        {/* Tail */}
        <path d="M70,78 Q78,72 76,66" fill="none"/>
      </g>
    </svg>
  );
}