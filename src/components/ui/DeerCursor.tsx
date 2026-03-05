"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Check for touch device — hide cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display  = "none";
      ring.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.1, ease: "power3.out" });
    };

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(tick);
    };

    const onEnter = () => ring.classList.add("hover");
    const onLeave = () => ring.classList.remove("hover");

    document.addEventListener("mousemove", onMove);
    const interactive = document.querySelectorAll("a, button, [data-cursor]");
    interactive.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}