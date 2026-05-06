"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Strip the animation, force a reflow, then re-apply it so it fires on every navigation
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
  }, [pathname]);

  return (
    <div ref={ref} className="animate-page-enter">
      {children}
    </div>
  );
}
