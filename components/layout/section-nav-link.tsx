"use client";

import { forwardRef, type ReactNode } from "react";
import { getSectionHref, getSectionId } from "@/lib/section-nav";
import type { Locale } from "@/types/locale";

export const SectionNavLink = forwardRef<
  HTMLAnchorElement,
  {
    locale: Locale;
    href: string;
    className?: string;
    children: ReactNode;
    onNavigate?: () => void;
  }
>(function SectionNavLink({ locale, href, className, children, onNavigate }, ref) {
  const sectionId = getSectionId(href);
  const targetHref = getSectionHref(locale, href);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const homePath = `/${locale}`;
    const onHome =
      window.location.pathname === homePath ||
      window.location.pathname === `${homePath}/`;

    if (!onHome) {
      return;
    }

    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", targetHref);
    onNavigate?.();
  };

  return (
    <a ref={ref} href={targetHref} className={className} onClick={handleClick}>
      {children}
    </a>
  );
});
