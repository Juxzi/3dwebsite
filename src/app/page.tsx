"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ThreeScene from "@/components/home/ThreeScene";
import MistOverlay from "@/components/home/MistOverlay";
import FloatingLeaves from "@/components/home/FloatingLeaves";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ── Palette ───────────────────────────────────────────────────
const C = {
  bg:       "#1C2B28",
  bgLight:  "#243330",
  card:     "#2E4440",
  cardHov:  "#344E49",
  border:   "rgba(177,182,149,0.15)",
  brown:    "#7D451B",
  sage:     "#B1B695",
  slate:    "#26413C",
  blue:     "#7699D4",
  coral:    "#F08080",
  textMain: "#EDE8DF",
  textSub:  "#cbd1c1",
  textMute: "#9ea09d",
};

// ── Skill row component ───────────────────────────────────────
function SkillRow({ s, i }: { s: typeof SKILLS[0]; i: number }) {
  const rowRef    = useRef<HTMLDivElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);
  const descRef   = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    gsap.to(numRef.current,  { x: 6,  duration: 0.4, ease: "power2.out" });
    gsap.to(descRef.current, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" });
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.out" });
  };
  const onLeave = () => {
    setHovered(false);
    gsap.to(numRef.current,  { x: 0,  duration: 0.4, ease: "power2.out" });
    gsap.to(descRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });
  };

  useEffect(() => {
    gsap.set(descRef.current, { height: 0, opacity: 0 });
    gsap.set(lineRef.current, { scaleX: 0 });
  }, []);

  return (
    <div
      ref={rowRef}
      className="skill-card opacity-0 group cursor-default"
      style={{ borderTop: `1px solid ${C.border}`, padding: "0" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Ligne colorée hover */}
      <div ref={lineRef} className="h-px origin-left" style={{ background: s.accent }} />

      <div className="flex items-center gap-8 py-7 px-2">
        {/* Numéro */}
        <span ref={numRef} className="font-mono text-[11px] tracking-widest w-8 shrink-0 transition-colors duration-300"
          style={{ color: hovered ? s.accent : C.textMute }}>{s.number}</span>

        {/* Titre grand */}
        <h3 className="flex-1 transition-colors duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(1.8rem,3.5vw,3rem)", color: hovered ? C.textMain : C.textSub,
            lineHeight: 1, letterSpacing: "-0.01em" }}>
          {s.title}
        </h3>

        {/* Tags — visibles en permanence */}
        <div className="hidden md:flex gap-2 shrink-0">
          {s.tags.map(t => (
            <span key={t} className="font-mono text-[9px] tracking-wider px-2 py-1 transition-all duration-300"
              style={{ color: hovered ? s.accent : C.textMute,
                border: `1px solid ${hovered ? s.accent + "50" : "transparent"}` }}>
              {t}
            </span>
          ))}
        </div>

        {/* Flèche */}
        <span className="font-mono text-lg transition-all duration-400"
          style={{ color: s.accent, opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)" }}>
          →
        </span>
      </div>

      {/* Description dépliable */}
      <div ref={descRef} style={{ overflow: "hidden" }}>
        <p className="px-16 pb-7 text-sm leading-relaxed max-w-2xl"
          style={{ color: C.textSub, fontWeight: 300 }}>{s.desc}</p>
      </div>

      {i === SKILLS.length - 1 && (
        <div style={{ borderBottom: `1px solid ${C.border}` }} />
      )}
    </div>
  );
}

const SKILLS = [
  { number: "01", title: "Surface Modelling", desc: "Alias Studio et Blender pour surfaces de haute précision — coques, carrosseries, produits industriels.", tags: ["Alias", "Blender", "Class-A"], accent: C.sage },
  { number: "02", title: "3D Rendering",       desc: "Rendus photoréalistes HDR, matériaux PBR et compositing avancé. Du prototype à l'image finale.",         tags: ["KeyShot", "Cycles", "PBR"],    accent: C.blue },
  { number: "03", title: "Product Design",     desc: "Conception de produits industriels et sportifs. De l'esquisse au modèle numérique finalisé.",              tags: ["Sketch", "CAD", "Proto"],      accent: C.brown },
  { number: "04", title: "Animation 3D",       desc: "Animation de produits et séquences de présentation pour vidéos commerciales et pitchs clients.",           tags: ["Blender", "Rigging", "Motion"],accent: C.coral },
];

const CLIENTS = ["Caperlan", "Decathlon", "RUBIKA", "IMTD", "WDC Lille", "BAO DigitalDesign"];

export default function HomePage() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();

    const heroItems = heroRef.current?.querySelectorAll(".h-item");
    if (heroItems?.length) {
      gsap.fromTo(heroItems,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out", delay: 2.4 }
      );
    }

    skillsRef.current?.querySelectorAll(".skill-card").forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" } }
      );
    });

    statsRef.current?.querySelectorAll(".stat-num").forEach(el => {
      const target = parseInt(el.getAttribute("data-val") ?? "0");
      const suffix = el.getAttribute("data-suffix") ?? "";
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: () => gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 2.2, ease: "power2.out",
          onUpdate: function() { el.textContent = Math.round((this.targets()[0] as any).val) + suffix; },
        }),
      });
    });

    document.querySelectorAll(".section-title").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" } }
      );
    });

    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 92%" } }
      );
    }

    gsap.to(".marquee-inner", { x: "-50%", duration: 22, ease: "none", repeat: -1 });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <FloatingLeaves count={28} />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-visible">

        <div className="absolute inset-0 z-0">
          <img src="/images/forest-bg.jpg" alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.38) saturate(0.6)" }}
          />
        </div>
        <MistOverlay />
        {/* Dégradé bas — z élevé pour passer par dessus le canvas */}
        <div className="absolute bottom-0 left-0 right-0 h-56 z-[6] pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.bg})` }} />

        <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-28 overflow-visible">

          {/* Texte gauche */}
          <div ref={heroRef}>
            <p className="h-item opacity-0 font-mono text-[11px] tracking-[0.5em] mb-10"
              style={{ color: C.sage }}>
              BAO DIGITALDESIGN · VALENCIENNES
            </p>

            <h1 className="h-item opacity-0 mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                fontSize: "clamp(3.5rem,7vw,6.5rem)", color: C.textMain,
                lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              3D Design<br />
              <em style={{ color: C.sage }}>&amp; Modelling</em>
            </h1>

            <div className="h-item opacity-0 w-14 mb-8"
              style={{ height: "1px", background: `linear-gradient(90deg, ${C.brown}, transparent)` }} />

            <p className="h-item opacity-0 max-w-sm leading-relaxed mb-12"
              style={{ color: C.textSub, fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8 }}>
              Surface modelling, rendering et animation —
              du concept industriel au rendu final photoréaliste.
            </p>

            <div className="h-item opacity-0 flex flex-wrap gap-4">
              <Link href="/work"
                className="group inline-flex items-center gap-4 font-mono text-xs tracking-[0.25em] transition-all duration-500"
                style={{ color: C.textMain, border: `1px solid ${C.border}`, padding: "14px 28px",
                  background: "rgba(125,69,27,0.15)" }}>
                VOIR LES PROJETS
                <span className="h-px w-5 group-hover:w-10 transition-all duration-500"
                  style={{ background: C.brown }} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center font-mono text-xs tracking-[0.25em] px-6 transition-colors duration-300"
                style={{ color: C.textMute }}>
                CONTACT →
              </Link>
            </div>

            <div className="h-item opacity-0 flex gap-8 mt-16 pt-8 flex-wrap"
              style={{ borderTop: `1px solid ${C.border}` }}>
              {[["Hugo Camart","Fondateur"], ["RUBIKA","Formation"], ["Valenciennes","Localisation"]].map(([v,l]) => (
                <div key={l}>
                  <p style={{ color: C.textMain, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300 }}>{v}</p>
                  <p className="font-mono text-[10px] tracking-widest mt-1" style={{ color: C.textMute }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Three.js droite — déborde volontairement */}
          <div className="w-full h-full min-h-screen" style={{ margin: "-15% -20%", width: "calc(100% + 40%)" }}>
            <ThreeScene />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 z-10 flex items-center gap-4">
          <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${C.sage}, transparent)` }} />
          <span className="font-mono text-[10px] tracking-[0.35em]" style={{ color: C.textMute }}>SCROLL</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — container clair
      ══════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-24" style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { val: 8,   suffix: "+", label: "Années d'expérience", color: C.brown },
            { val: 30,  suffix: "+", label: "Projets réalisés",    color: C.sage  },
            { val: 3,   suffix: "",  label: "Secteurs maîtrisés",  color: C.blue  },
            { val: 200, suffix: "+", label: "Étudiants formés",    color: C.coral },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="stat-num leading-none mb-3"
                data-val={s.val} data-suffix={s.suffix}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                  fontSize: "clamp(3rem,6vw,5rem)", color: s.color }}>
                0{s.suffix}
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.textSub }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SKILLS — liste éditoriale innovante
      ══════════════════════════════════════════════════ */}
      <section className="py-36" style={{ background: C.bgLight }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-end justify-between mb-20 gap-8 flex-wrap">
            <div>
              <p className="section-title font-mono text-[11px] tracking-[0.45em] mb-5 opacity-0" style={{ color: C.brown }}>— EXPERTISES</p>
              <h2 className="section-title opacity-0"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                  fontSize: "clamp(2.8rem,5vw,4.2rem)", color: C.textMain }}>
                Ce que je crée
              </h2>
            </div>
            <p className="section-title opacity-0 font-mono text-[10px] tracking-widest max-w-xs text-right" style={{ color: C.textMute }}>
              04 DISCIPLINES · VALENCIENNES
            </p>
          </div>

          {/* Liste éditoriale — chaque skill est une ligne pleine largeur */}
          <div ref={skillsRef}>
            {SKILLS.map((s, i) => (
              <SkillRow key={i} s={s} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          À PROPOS — container clair horizontal
      ══════════════════════════════════════════════════ */}


      {/* ══════════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════════ */}
      <section className="py-14 overflow-hidden" style={{ background: C.bgLight, borderTop: `1px solid ${C.border}` }}>
        <div className="marquee-inner flex whitespace-nowrap w-max">
          {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((c, i) => (
            <span key={i} className="px-14"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                fontSize: "clamp(2.5rem,4vw,3.5rem)", color: `${C.sage}18`, fontStyle: "italic" }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-48 opacity-0" style={{ background: C.bg }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.45em] mb-10" style={{ color: C.brown }}>— COLLABORONS</p>
          <h2 className="leading-tight mb-14"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(3.5rem,9vw,8rem)", color: C.textMain }}>
            Un projet<br />
            <em style={{ color: C.sage }}>en tête ?</em>
          </h2>
          <Link href="/contact"
            className="inline-flex items-center gap-8 font-mono text-xs tracking-[0.3em] transition-all duration-500 group"
            style={{ color: C.textMain, border: `1px solid ${C.border}`, padding: "18px 48px",
              background: `${C.brown}15` }}>
            PRENDRE CONTACT
            <span className="h-px w-8 group-hover:w-20 transition-all duration-500" style={{ background: C.brown }} />
          </Link>
        </div>
      </section>

    </div>
  );
}