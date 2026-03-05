import { getProjects } from "@/lib/firestore";
import ProjectGrid from "@/components/work/ProjectGrid";

export const revalidate = 60;

const C = {
  bg: "#1C2B28", card: "#2E4440", border: "rgba(177,182,149,0.12)",
  sage: "#B1B695", brown: "#7D451B", text: "#EDE8DF", muted: "#5A6B52", sub: "#8E9B7A",
};

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>

      {/* Background photo très sombre */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/images/forest-bg.jpg" alt="" className="w-full h-full object-cover"
          style={{ filter: "brightness(0.15) saturate(0.4)", opacity: 0.6 }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-40 pb-32">

        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-8">
            <span className="font-mono text-[10px] tracking-[0.5em]" style={{ color: C.brown }}>— 00</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${C.brown}60, transparent)` }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(4rem,10vw,9rem)", color: C.text, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
            Work
          </h1>
          <p className="mt-6 font-mono text-[11px] tracking-[0.4em]" style={{ color: C.muted }}>
            {projects.length} PROJET{projects.length > 1 ? "S" : ""}
          </p>
        </div>

        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}