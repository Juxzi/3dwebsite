"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MistOverlay() {
  const m1 = useRef<HTMLDivElement>(null);
  const m2 = useRef<HTMLDivElement>(null);
  const m3 = useRef<HTMLDivElement>(null);
  const m4 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dérive horizontale continue — chaque couche à vitesse différente
    gsap.to(m1.current, { x: "6%",  duration: 20, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(m2.current, { x: "-8%", duration: 28, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });
    gsap.to(m3.current, { x: "5%",  duration: 35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 7 });
    gsap.to(m4.current, { x: "-4%", duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });

    // Pulsation d'opacité subtile
    gsap.to(m1.current, { opacity: 0.55, duration: 6,  ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(m2.current, { opacity: 0.35, duration: 9,  ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
    gsap.to(m3.current, { opacity: 0.2,  duration: 12, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 5 });
    gsap.to(m4.current, { opacity: 0.45, duration: 8,  ease: "sine.inOut", yoyo: true, repeat: -1, delay: 4 });
  }, []);

  const base: React.CSSProperties = {
    position: "absolute",
    left: "-10%",
    width: "120%",
    pointerEvents: "none",
    mixBlendMode: "screen",
    filter: "blur(18px)",
  };

  return (
    <>
      {/* Couche 1 — brume basse et dense */}
      <div ref={m1} style={{
        ...base,
        bottom: "5%",
        height: "25vh",
        opacity: 0.45,
        zIndex: 2,
        background: "radial-gradient(ellipse 100% 60% at 40% 80%, rgba(180,210,185,0.32) 0%, rgba(140,175,150,0.1) 50%, transparent 80%)",
      }}/>

      {/* Couche 2 — brume mi-hauteur */}
      <div ref={m2} style={{
        ...base,
        bottom: "22%",
        height: "20vh",
        opacity: 0.28,
        zIndex: 2,
        background: "radial-gradient(ellipse 120% 50% at 65% 70%, rgba(200,220,200,0.22) 0%, rgba(160,190,165,0.08) 60%, transparent 85%)",
      }}/>

      {/* Couche 3 — voile haute et diffus */}
      <div ref={m3} style={{
        ...base,
        bottom: "38%",
        height: "18vh",
        opacity: 0.15,
        zIndex: 2,
        background: "radial-gradient(ellipse 140% 40% at 30% 60%, rgba(210,225,210,0.18) 0%, transparent 70%)",
        filter: "blur(28px)",
      }}/>

      {/* Couche 4 — bande de brume fine près du sol */}
      <div ref={m4} style={{
        ...base,
        bottom: "12%",
        height: "10vh",
        opacity: 0.4,
        zIndex: 3,
        background: "radial-gradient(ellipse 80% 80% at 55% 100%, rgba(190,215,195,0.28) 0%, transparent 75%)",
        filter: "blur(12px)",
      }}/>
    </>
  );
}