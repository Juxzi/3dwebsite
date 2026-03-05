"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Loader() {
  const loaderRef  = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100, duration: 1, ease: "power4.inOut",
          onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = "none"; },
        });
      },
    });

    // Logo apparaît
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.75, filter: "blur(12px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
    )
    // Lignes déco
    .fromTo(line1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.4")
    .fromTo(line2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.7")
    // Label
    .fromTo(labelRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    // Barre + compteur
    .to(barRef.current, {
      width: "100%", duration: 1.4, ease: "power2.inOut",
      onUpdate: function() {
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(this.progress() * 100) + "%";
        }
      },
    }, "-=0.2")
    // Fade out doux
    .to([logoRef.current, labelRef.current, line1Ref.current, line2Ref.current],
      { opacity: 0.3, duration: 0.3 }
    );
  }, []);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10"
      style={{ background: "#1C2B28" }}>

      {/* Ligne déco haute */}
      <div ref={line1Ref} className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ background: "linear-gradient(90deg, #7D451B, #B1B695, transparent)", transform: "scaleX(0)" }} />

      {/* Logo cerf */}
      <div ref={logoRef} className="opacity-0" style={{ filter: "drop-shadow(0 0 30px rgba(177,182,149,0.3))" }}>
        <svg width="52" height="94" viewBox="0 0 1126 2048" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 285 16 L 260 91 L 260 103 L 251 168 L 252 196 L 260 274 L 291 345 L 306 415 L 291 487 L 276 538 L 271 539 L 235 533 L 184 503 L 125 449 L 85 390 L 83 390 L 108 459 L 121 475 L 149 516 L 216 560 L 235 564 L 288 580 L 325 609 L 334 614 L 348 628 L 396 708 L 399 727 L 417 791 L 425 874 L 395 875 L 328 871 L 265 856 L 214 832 L 167 794 L 163 786 L 133 745 L 109 686 L 107 684 L 106 685 L 110 712 L 119 756 L 136 784 L 144 801 L 150 809 L 204 853 L 212 856 L 257 884 L 322 906 L 387 906 L 413 913 L 435 916 L 438 919 L 447 945 L 459 971 L 460 998 L 408 997 L 391 982 L 380 951 L 364 942 L 361 942 L 367 964 L 366 993 L 338 1009 L 298 1002 L 253 977 L 228 943 L 215 943 L 233 975 L 262 1009 L 262 1012 L 316 1036 L 440 1045 L 444 1054 L 420 1065 L 415 1071 L 413 1076 L 383 1117 L 361 1160 L 350 1177 L 305 1217 L 245 1246 L 194 1287 L 188 1326 L 235 1369 L 248 1372 L 273 1374 L 302 1379 L 341 1374 L 416 1370 L 488 1370 L 498 1394 L 489 1443 L 488 1457 L 453 1510 L 396 1540 L 381 1544 L 374 1544 L 322 1559 L 317 1559 L 213 1590 L 150 1620 L 98 1651 L 55 1686 L 16 1729 L 13 1735 L 134 1709 L 220 1706 L 344 1709 L 446 1755 L 457 1758 L 549 1836 L 586 1884 L 611 1913 L 624 1931 L 630 1948 L 642 1972 L 642 1976 L 657 2009 L 659 2017 L 666 2033 L 668 2033 L 717 1945 L 717 1941 L 732 1905 L 734 1895 L 746 1868 L 775 1789 L 778 1786 L 780 1774 L 792 1746 L 816 1677 L 819 1676 L 818 1668 L 842 1518 L 840 1376 L 818 1265 L 767 1175 L 742 1115 L 776 1109 L 824 1074 L 857 1030 L 863 1025 L 862 1024 L 888 961 L 800 965 L 751 978 L 745 978 L 701 1009 L 679 1038 L 675 1041 L 626 1041 L 624 1039 L 618 1008 L 658 971 L 710 944 L 753 919 L 870 879 L 973 826 L 1051 735 L 1065 716 L 1069 704 L 1110 620 L 1110 520 L 1100 470 L 1099 455 L 1089 400 L 1084 335 L 1084 277 L 1089 190 L 1051 113 L 1059 193 L 1062 278 L 1054 281 L 1028 248 L 990 171 L 955 120 L 944 98 L 917 54 L 914 46 L 911 42 L 909 42 L 938 136 L 952 166 L 978 214 L 982 226 L 994 247 L 995 253 L 1007 276 L 1025 321 L 1051 377 L 1055 424 L 1063 478 L 1070 548 L 1073 598 L 1057 632 L 1048 656 L 992 742 L 983 742 L 981 740 L 972 676 L 947 611 L 946 604 L 917 561 L 915 555 L 901 535 L 900 531 L 897 530 L 895 551 L 934 632 L 958 713 L 958 718 L 948 744 L 948 749 L 933 794 L 856 844 L 763 878 L 688 897 L 633 919 L 606 932 L 597 934 L 572 871 L 568 757 L 576 663 L 576 650 L 572 649 L 553 727 L 550 762 L 542 815 L 543 841 L 556 926 L 560 987 L 527 994 L 481 923 L 474 900 L 470 878 L 458 840 L 456 827 L 442 781 L 442 775 L 426 715 L 376 622 L 360 583 L 333 525 L 333 415 L 365 334 L 432 263 L 467 236 L 523 183 L 526 182 L 546 159 L 549 153 L 576 123 L 599 75 L 611 14 L 599 32 L 560 105 L 509 164 L 457 216 L 426 242 L 415 248 L 372 279 L 319 291 L 312 290 L 291 258 L 289 241 L 279 198 L 279 92 L 289 18 Z"
            fill="#B1B695" fillRule="evenodd"/>
        </svg>
      </div>

      {/* Label + barre */}
      <div className="flex flex-col items-center gap-5 w-52">
        <span ref={labelRef} className="font-mono text-[10px] tracking-[0.5em] opacity-0"
          style={{ color: "#5A6B52" }}>
          BAO DIGITALDESIGN
        </span>

        <div className="w-full relative" style={{ height: "1px", background: "rgba(177,182,149,0.1)" }}>
          <div ref={barRef} className="absolute left-0 top-0 h-full"
            style={{ width: "0%", background: "linear-gradient(90deg, #7D451B, #B1B695)" }} />
        </div>

        <span ref={percentRef} className="font-mono text-[10px] tracking-widest self-end"
          style={{ color: "#5A6B52" }}>
          0%
        </span>
      </div>

      {/* Ligne déco basse */}
      <div ref={line2Ref} className="absolute bottom-0 left-0 right-0 h-px origin-right"
        style={{ background: "linear-gradient(90deg, transparent, #B1B695, #7D451B)", transform: "scaleX(0)" }} />
    </div>
  );
}