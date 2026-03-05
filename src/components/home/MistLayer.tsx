"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MistLayer() {
  const m1 = useRef<HTMLDivElement>(null);
  const m2 = useRef<HTMLDivElement>(null);
  const m3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ambient drift animations (always running)
    gsap.to(m1.current, {
      x: "4%", duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1,
    });
    gsap.to(m2.current, {
      x: "-3%", duration: 24, ease: "sine.inOut", yoyo: true, repeat: -1,
    });
    gsap.to(m3.current, {
      x: "5%", duration: 32, ease: "sine.inOut", yoyo: true, repeat: -1,
    });

    // Scroll-driven opacity + vertical shift
    gsap.to([m1.current, m2.current, m3.current], {
      opacity: 0.6,
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "30% top",
        scrub: 1.5,
      },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Layer 1 — low mist */}
      <div
        ref={m1}
        className="mist-layer"
        style={{
          bottom: "15%",
          height: "18vh",
          background: "radial-gradient(ellipse 120% 60% at 50% 100%, rgba(200,220,210,0.22) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      {/* Layer 2 — mid mist */}
      <div
        ref={m2}
        className="mist-layer"
        style={{
          bottom: "30%",
          height: "14vh",
          background: "radial-gradient(ellipse 140% 50% at 40% 100%, rgba(180,210,195,0.14) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      {/* Layer 3 — high mist / veil */}
      <div
        ref={m3}
        className="mist-layer"
        style={{
          bottom: "45%",
          height: "10vh",
          background: "radial-gradient(ellipse 100% 40% at 60% 100%, rgba(210,225,215,0.08) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}