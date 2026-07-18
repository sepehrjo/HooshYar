'use client';

import Lenis from 'lenis';
import {usePathname} from 'next/navigation';
import {useEffect, type ReactNode} from 'react';

export function SmoothScrollProvider({children}: {children: ReactNode}) {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSnapHome = /^\/(en|fa)\/?$/.test(pathname);

    if (reducedMotion || coarsePointer || isSnapHome) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [pathname]);

  return children;
}
