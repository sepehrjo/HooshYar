"use client";

import { useEffect, type ReactNode } from "react";

export function ScrollSnapShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "auto" });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main
      data-scroll-snap="true"
      className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth scroll-pt-24"
    >
      {children}
    </main>
  );
}
