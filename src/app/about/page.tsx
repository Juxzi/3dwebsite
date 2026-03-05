"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const C = {
  bg: "#1C2B28", bgLight: "#243330", card: "#2E4440", cardHov: "#344E49",
  border: "rgba(177,182,149,0.12)", sage: "#B1B695", brown: "#7D451B",
  blue: "#7699D4", coral: "#F08080", text: "#EDE8DF", sub: "#8E9B7A", muted: "#5A6B52",
};

const EDU = [
  { year: "En cours", title: "Digital Design",              school: "RUBIKA Valenciennes",      color: C.sage  },
  { year: "2017–19",  title: "Product Design",              school: "RUBIKA Valenciennes",      color: C.sage  },
  { year: "2015–17",  title: "Licence Mécanique & Robotique", school: "Université de Lille I",  color: C.blue  },
  { year: "2014–15",  title: "Classes Prépa Maths",         school: "Lycée Henri Wallon",       color: C.brown },
  { year: "2014",     title: "Baccalauréat Scientifique",   school: "Lycée Henri Wallon",       color: C.brown },
];

const EXP = [
  { role: "Instructor",        co: "RUBIKA & RUBIKA MONTBÉLIARD", period: "En cours", color: C.sage,
    desc: "Enseignement Alias, Blender, Photographie et Rendu pour les Masters Digital Design." },
  { role: "Fondateur",         co: "BAO DigitalDesign",           period: "En cours", color: C.brown,
    desc: "Studio spécialisé en modélisation 3D de surface, rendu et animation." },
  { role: "Digital Designer",  co: "Caperlan · Decathlon",        period: "2022",     color: C.blue,
    desc: "Équipe REEL, conception adaptée aux contraintes techniques et clients internationaux." },
  { role: "Designer 3D / VR",  co: "I.M.T.D. Valenciennes",      period: "2021",     color: C.coral,
    desc: "Réalité virtuelle et augmentée. Design intérieur RER NG pour PMR." },
  { role: "Designer",          co: "WDC Lille",                   period: "2019",     color: C.sage,
    desc: "Comment faire adopter le Design aux 70 000 étudiants lillois ?" },
  { role: "Stagiaire",         co: "ERPRO Group",                 period: "2018",     color: C.brown,
    desc: "Fabrication additive, stéréolithographie, gestion de commandes." },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current?.querySelectorAll(".h-item") ?? [],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.3 }
    );
    document.querySelectorAll(".reveal").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" } }
      );
    });
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/images/forest-bg.jpg" alt="" className="w-full h-full object-cover"
          style={{ filter: "brightness(0.12) saturate(0.4)", opacity: 0.5 }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-40 pb-32">

        {/* Hero */}
        <div ref={heroRef} className="mb-32">
          <div className="flex items-center gap-6 mb-10">
            <span className="h-item opacity-0 font-mono text-[10px] tracking-[0.5em]" style={{ color: C.brown }}>— ABOUT</span>
            <div className="h-item opacity-0 h-px flex-1" style={{ background: `linear-gradient(90deg, ${C.brown}50, transparent)` }} />
          </div>

          <h1 className="h-item opacity-0 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(1.2rem,3vw,2rem)", color: C.sub, fontStyle: "italic" }}>
            Hi, I'm
          </h1>
          <h2 className="h-item opacity-0 mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(4rem,10vw,8rem)", color: C.text, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
            Hugo<br /><span style={{ color: C.sage }}>Camart</span>
          </h2>

          <p className="h-item opacity-0 max-w-lg leading-relaxed mb-10"
            style={{ color: C.sub, fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8 }}>
            Fondateur de BAO DigitalDesign. Designer industriel et modélisateur 3D
            formé à RUBIKA Valenciennes, passionné par la précision des formes et la nature.
          </p>

          <Link href="/work" className="h-item opacity-0 inline-flex items-center gap-4 font-mono text-xs tracking-[0.25em] group transition-all duration-500"
            style={{ color: C.text, border: `1px solid ${C.border}`, padding: "12px 24px", background: `${C.brown}15` }}>
            VOIR MON TRAVAIL
            <span className="h-px w-5 group-hover:w-10 transition-all duration-500" style={{ background: C.brown }} />
          </Link>
        </div>

        {/* Formation */}
        <Section label="01" title="Formation" color={C.sage} />
        <div className="mb-28 space-y-0">
          {EDU.map((e, i) => (
            <div key={i} className="reveal opacity-0 group flex gap-8 py-6 transition-colors duration-300 cursor-default"
              style={{ borderBottom: `1px solid ${C.border}` }}
              onMouseEnter={el => (el.currentTarget.style.background = C.bgLight)}
              onMouseLeave={el => (el.currentTarget.style.background = "transparent")}>
              <span className="font-mono text-[10px] tracking-wider w-20 shrink-0 pt-1" style={{ color: C.muted }}>
                {e.year}
              </span>
              <div className="flex-1">
                <p style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300 }}>
                  {e.title}
                </p>
                <p className="font-mono text-[10px] tracking-wider mt-1" style={{ color: e.color }}>{e.school}</p>
              </div>
              <div className="w-1 self-stretch rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: e.color }} />
            </div>
          ))}
        </div>

        {/* Expériences */}
        <Section label="02" title="Expériences" color={C.brown} />
        <div className="mb-28 relative">
          {/* Timeline line */}
          <div className="absolute left-[88px] top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${C.brown}40, ${C.sage}40, transparent)` }} />

          {EXP.map((e, i) => (
            <div key={i} className="reveal opacity-0 flex gap-8 mb-14 group">
              <div className="w-20 shrink-0 text-right">
                <span className="font-mono text-[10px] tracking-wider" style={{ color: C.muted }}>{e.period}</span>
              </div>
              <div className="relative pl-10">
                {/* Dot */}
                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300"
                  style={{ background: C.bg, borderColor: e.color }} />
                <p style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, lineHeight: 1 }}>
                  {e.role}
                </p>
                <p className="font-mono text-[10px] tracking-wider mt-2 mb-3" style={{ color: e.color }}>{e.co}</p>
                <p className="text-sm leading-relaxed" style={{ color: C.muted, fontWeight: 300 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hobbies */}
        <Section label="03" title="En dehors" color={C.blue} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-20"
          style={{ background: C.border }}>
          {[
            { icon: "🦌", title: "Éleveur", desc: "Cerfs, alpacas, wallabys et toutes sortes de volailles.", color: C.brown },
            { icon: "🏐", title: "Volleyball", desc: "Champions de France en compétition de haut niveau.", color: C.blue },
            { icon: "📷", title: "Photographie", desc: "Cadrage de sujets en mouvement, lumière naturelle.", color: C.sage },
          ].map((h, i) => (
            <div key={i} className="reveal opacity-0 p-10 transition-colors duration-300"
              style={{ background: C.card }}
              onMouseEnter={e => (e.currentTarget.style.background = C.cardHov)}
              onMouseLeave={e => (e.currentTarget.style.background = C.card)}>
              <span className="text-2xl mb-6 block">{h.icon}</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem",
                fontWeight: 300, color: h.color, marginBottom: "8px" }}>{h.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: C.muted, fontWeight: 300 }}>{h.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function Section({ label, title, color }: { label: string; title: string; color: string }) {
  return (
    <div className="reveal opacity-0 flex items-center gap-6 mb-12">
      <span className="font-mono text-[10px] tracking-[0.4em]" style={{ color }}>{label}</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: "clamp(2rem,4vw,3rem)", color: "#EDE8DF", lineHeight: 1 }}>{title}</h2>
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  );
}