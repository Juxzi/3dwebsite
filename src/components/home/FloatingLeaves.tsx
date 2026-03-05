"use client";
import { useEffect, useRef } from "react";

const LEAF_DEFS = [
  {
    path: "M0,-22 C3,-20 7,-18 6,-14 C9,-15 11,-12 8,-10 C11,-10 11,-7 8,-6 C10,-5 9,-2 6,-2 C7,0 5,4 0,6 C-5,4 -7,0 -6,-2 C-9,-2 -10,-5 -8,-6 C-11,-7 -11,-10 -8,-10 C-11,-12 -9,-15 -6,-14 C-7,-18 -3,-20 0,-22 Z",
    veins: [
      { x1: 0, y1: -20, x2: 0,  y2: 4   },
      { x1: 0, y1: -14, x2: 5,  y2: -10 }, { x1: 0, y1: -14, x2: -5, y2: -10 },
      { x1: 0, y1: -8,  x2: 6,  y2: -5  }, { x1: 0, y1: -8,  x2: -6, y2: -5  },
      { x1: 0, y1: -2,  x2: 4,  y2: 0   }, { x1: 0, y1: -2,  x2: -4, y2: 0   },
    ],
  },
  {
    path: "M0,-24 C2,-20 1,-16 4,-14 C7,-16 10,-14 8,-11 C11,-11 12,-8 9,-7 C11,-4 8,-1 5,-2 C4,1 2,5 0,7 C-2,5 -4,1 -5,-2 C-8,-1 -11,-4 -9,-7 C-12,-8 -11,-11 -8,-11 C-10,-14 -7,-16 -4,-14 C-1,-16 -2,-20 0,-24 Z",
    veins: [
      { x1: 0, y1: -22, x2: 0,  y2: 5   },
      { x1: 0, y1: -18, x2: 3,  y2: -14 }, { x1: 0, y1: -18, x2: -3, y2: -14 },
      { x1: 0, y1: -10, x2: 7,  y2: -8  }, { x1: 0, y1: -10, x2: -7, y2: -8  },
      { x1: 0, y1: -4,  x2: 4,  y2: -2  }, { x1: 0, y1: -4,  x2: -4, y2: -2  },
    ],
  },
  {
    path: "M0,-24 C5,-20 9,-14 9,-6 C9,2 5,8 0,10 C-5,8 -9,2 -9,-6 C-9,-14 -5,-20 0,-24 Z",
    veins: [
      { x1: 0, y1: -22, x2: 0,  y2: 8   },
      { x1: 0, y1: -16, x2: 6,  y2: -12 }, { x1: 0, y1: -16, x2: -6, y2: -12 },
      { x1: 0, y1: -8,  x2: 7,  y2: -4  }, { x1: 0, y1: -8,  x2: -7, y2: -4  },
      { x1: 0, y1: 0,   x2: 5,  y2: 3   }, { x1: 0, y1: 0,   x2: -5, y2: 3   },
    ],
  },
  {
    path: "M0,-18 C8,-16 14,-8 12,0 C10,8 5,12 0,12 C-5,12 -10,8 -12,0 C-14,-8 -8,-16 0,-18 Z",
    veins: [
      { x1: 0, y1: -16, x2: 0,  y2: 10 },
      { x1: 0, y1: -10, x2: 8,  y2: -6 }, { x1: 0, y1: -10, x2: -8, y2: -6 },
      { x1: 0, y1: -2,  x2: 9,  y2: 2  }, { x1: 0, y1: -2,  x2: -9, y2: 2  },
      { x1: 0, y1: 5,   x2: 6,  y2: 8  }, { x1: 0, y1: 5,   x2: -6, y2: 8  },
    ],
  },
];

const LEAF_COLORS = [
  { fill: "#7D9B6A", vein: "#5A7A4A", shadow: "#4A6A3A" },
  { fill: "#8E9B7A", vein: "#6B7A5A", shadow: "#5A6B4A" },
  { fill: "#B1B695", vein: "#8A9070", shadow: "#7A8060" },
  { fill: "#6B8F5E", vein: "#4A6F3E", shadow: "#3A5F2E" },
  { fill: "#A3B88C", vein: "#80956A", shadow: "#6A8558" },
  { fill: "#5A7A50", vein: "#3A5A30", shadow: "#2A4A20" },
];

const MAX_VEL  = 2.5;
const MAX_VROT = 1.0;

interface Leaf {
  baseX: number;
  baseY: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  scrollFactor: number;
  opacity: number;
  x: number;
  y: number;
  rot: number;
  vx: number;
  vy: number;
  vrot: number;
}

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function clamp(v: number, max: number) {
  return Math.max(-max, Math.min(max, v));
}

function buildSprites(count: number): HTMLCanvasElement[] {
  const r0 = rng(77);
  return Array.from({ length: count }, () => {
    const defIdx   = Math.floor(r0() * LEAF_DEFS.length);
    const colorIdx = Math.floor(r0() * LEAF_COLORS.length);
    const size     = 14 + r0() * 22;
    const def      = LEAF_DEFS[defIdx];
    const col      = LEAF_COLORS[colorIdx];
    const scale    = size / 24;
    const pad      = 8;

    const oc = document.createElement("canvas");
    oc.width  = size * 3 + pad * 2;
    oc.height = size * 3 + pad * 2;
    const c   = oc.getContext("2d")!;

    c.translate(oc.width / 2, oc.height / 2);
    c.scale(scale, scale);

    c.shadowColor   = col.shadow;
    c.shadowBlur    = 6 / scale;
    c.shadowOffsetX = 1 / scale;
    c.shadowOffsetY = 2 / scale;

    const grad = c.createLinearGradient(0, -24, 0, 12);
    grad.addColorStop(0, col.fill);
    grad.addColorStop(0.5, col.fill + "EE");
    grad.addColorStop(1, col.shadow);
    c.fillStyle = grad;
    c.fill(new Path2D(def.path));

    c.shadowColor = "transparent";
    c.strokeStyle = col.shadow;
    c.lineWidth   = 0.6 / scale;
    c.globalAlpha = 0.5;
    c.stroke(new Path2D(def.path));

    c.strokeStyle = col.vein;
    c.lineCap     = "round";
    def.veins.forEach((v, idx) => {
      c.lineWidth   = idx === 0 ? 1.2 : 0.55;
      c.globalAlpha = idx === 0 ? 0.65 : 0.4;
      c.beginPath();
      c.moveTo(v.x1, v.y1);
      c.lineTo(v.x2, v.y2);
      c.stroke();
    });

    const refGrad = c.createLinearGradient(-4, -20, 4, -8);
    refGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    refGrad.addColorStop(1, "rgba(255,255,255,0)");
    c.globalAlpha = 1;
    c.fillStyle   = refGrad;
    c.fill(new Path2D(def.path));

    return oc;
  });
}

export default function FloatingLeaves({ count = 40 }: { count?: number }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const leavesRef  = useRef<Leaf[]>([]);
  const spritesRef = useRef<HTMLCanvasElement[]>([]);
  const mousePrev  = useRef({ x: -9999, y: -9999 });
  const mouseCur   = useRef({ x: -9999, y: -9999 });
  const scrollRef  = useRef(0);
  const rafRef     = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    spritesRef.current = buildSprites(count);

    // Attend que le DOM soit fully rendered pour avoir le vrai scrollHeight
    const init = () => {
      const W     = window.innerWidth;
      const pageH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 5
      );

      const r1 = rng(42);
      scrollRef.current = window.scrollY;

      leavesRef.current = Array.from({ length: count }, () => {
        const bx = r1() * W;
        // Répartition uniforme sur TOUTE la hauteur de la page
        const by = r1() * pageH;
        // Position de départ visible = position absolue - scroll actuel
        const startY = by - scrollRef.current;
        return {
          baseX: bx,
          baseY: by,
          swayAmp:      3 + r1() * 7,
          swayFreq:     0.15 + r1() * 0.4,
          swayPhase:    r1() * Math.PI * 2,
          // Chaque feuille a sa propre vitesse de parallaxe
          // scrollFactor = 1 : suit exactement le scroll (comme un élément fixed sur la page)
          // scrollFactor < 1 : effet parallaxe (bouge moins vite que le scroll)
          scrollFactor: 0.5 + r1() * 0.5,
          opacity:      0.55 + r1() * 0.35,
          x:    bx,
          y:    startY,
          rot:  r1() * 360,
          vx:   0,
          vy:   0,
          vrot: (r1() - 0.5) * 0.1,
        };
      });
    };

    // 200ms pour laisser Next.js hydrater et le DOM calculer sa vraie hauteur
    const t = setTimeout(init, 200);

    // ── Souris ────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mousePrev.current.x;
      const dy = e.clientY - mousePrev.current.y;
      mousePrev.current = { ...mouseCur.current };
      mouseCur.current  = { x: e.clientX, y: e.clientY };
      const speed = Math.hypot(dx, dy);
      if (speed < 2) return;
      leavesRef.current.forEach(leaf => {
        const dist = Math.hypot(e.clientX - leaf.x, e.clientY - leaf.y);
        const R = 160;
        if (dist < R) {
          const f = (1 - dist / R) * Math.min(speed, 25) * 0.004;
          leaf.vx   = clamp(leaf.vx   + dx * f, MAX_VEL);
          leaf.vy   = clamp(leaf.vy   + dy * f, MAX_VEL);
          leaf.vrot = clamp(leaf.vrot + (dx - dy) * f * 0.06, MAX_VROT);
        }
      });
    };

    // ── Clic ──────────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      leavesRef.current.forEach(leaf => {
        const dist = Math.hypot(e.clientX - leaf.x, e.clientY - leaf.y);
        const R = 260;
        if (dist < R) {
          const angle    = Math.atan2(leaf.y - e.clientY, leaf.x - e.clientX);
          const strength = (1 - dist / R) * 3.5;
          leaf.vx   = clamp(leaf.vx   + Math.cos(angle) * strength, MAX_VEL);
          leaf.vy   = clamp(leaf.vy   + Math.sin(angle) * strength, MAX_VEL);
          leaf.vrot = clamp(leaf.vrot + (Math.random() - 0.5) * 1.2, MAX_VROT);
        }
      });
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Boucle ────────────────────────────────────────────────
    let prev = 0;
    const loop = (ts: number) => {
      const dt = Math.min((ts - prev) / 16.67, 2);
      prev = ts;
      const time = ts * 0.001;
      const W    = canvas.width;
      const H    = canvas.height;
      const sc   = scrollRef.current;

      ctx.clearRect(0, 0, W, H);

      leavesRef.current.forEach((leaf, i) => {
        // Cible Y visible dans la fenêtre
        // baseY = position absolue sur la page
        // on soustrait scroll * scrollFactor pour l'effet parallaxe
        const targetY = leaf.baseY - sc * leaf.scrollFactor;
        const swayX   = Math.sin(time * leaf.swayFreq + leaf.swayPhase) * leaf.swayAmp;
        const swayY   = Math.cos(time * leaf.swayFreq * 0.6 + leaf.swayPhase) * leaf.swayAmp * 0.4;

        leaf.vx   += (leaf.baseX + swayX - leaf.x) * 0.012 * dt;
        leaf.vy   += (targetY   + swayY  - leaf.y) * 0.012 * dt;

        leaf.vx   *= 0.88;
        leaf.vy   *= 0.88;
        leaf.vrot *= 0.92;

        leaf.vx   = clamp(leaf.vx,   MAX_VEL);
        leaf.vy   = clamp(leaf.vy,   MAX_VEL);
        leaf.vrot = clamp(leaf.vrot, MAX_VROT);

        leaf.x   += leaf.vx   * dt;
        leaf.y   += leaf.vy   * dt;
        leaf.rot += (leaf.vrot + Math.sin(time * leaf.swayFreq * 0.4 + leaf.swayPhase) * 0.1) * dt;

        if (leaf.x < -50)  leaf.x = W + 30;
        if (leaf.x > W+50) leaf.x = -30;
        if (leaf.y < -100 || leaf.y > H + 100) return;

        const sprite = spritesRef.current[i];
        if (!sprite) return;

        ctx.save();
        ctx.globalAlpha = leaf.opacity;
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate((leaf.rot * Math.PI) / 180);
        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  );
}