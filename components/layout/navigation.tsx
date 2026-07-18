"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionNavLink } from "@/components/layout/section-nav-link";
import { LogoMark } from "@/components/ui/logo-mark";
import { getSectionHref } from "@/lib/section-nav";
import { siteContent as defaultSiteContent } from "@/lib/site";
import type { SiteContentData } from "@/lib/content/utils";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/locale";

export function Navigation({
  locale,
  site = defaultSiteContent as SiteContentData,
}: {
  locale: Locale;
  site?: SiteContentData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("/");
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const navLinksRef = useRef<Map<string, HTMLElement>>(new Map());
  const otherLocale: Locale = locale === "en" ? "fa" : "en";
  const ctaLabel = locale === "fa" ? "شروع همکاری" : "Get Started";
  const menuLabel = locale === "fa" ? "فهرست" : "Menu";
  const isRTL = locale === "fa";

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section from scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0.3
        );
        
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          const mostVisible = visibleEntries[0];
          const id = mostVisible.target.id;
          
          // Map section IDs to navigation hrefs
          const sectionMap: Record<string, string> = {
            'home': '/',
            'about': '/about',
            'services': '/services',
            'portfolio': '/work',
            'process': '/process',
            'contact': '/contact',
          };
          
          const href = sectionMap[id] || '/';
          setActiveSection(href);
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    const sections = document.querySelectorAll(
      '[id^="home"], [id="about"], [id="services"], [id="portfolio"], [id="process"], [id="contact"]'
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Special observer for tall sections (Services) with lower threshold
  useEffect(() => {
    const tallSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When services section enters the middle viewport area, activate it
          if (entry.isIntersecting && entry.target.id === 'services') {
            setActiveSection('/services');
          }
        });
      },
      { 
        threshold: 0,
        rootMargin: '-10% 0px -80% 0px'
      }
    );

    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      tallSectionObserver.observe(servicesSection);
    }

    return () => tallSectionObserver.disconnect();
  }, []);

  // Pathname fallback for standalone pages (future-proofing)
  useEffect(() => {
    // Small delay to let DOM settle and IntersectionObserver run first
    const timer = setTimeout(() => {
      const path = window.location.pathname;
      const normalizedPath = path.replace(/^\/[a-z]{2}/, '').replace(/\/$/, '') || '/';
      
      const navPaths = ['/', '/about', '/services', '/work', '/process', '/contact'];
      
      if (navPaths.includes(normalizedPath)) {
        const sectionId = normalizedPath === '/' ? 'home' : normalizedPath.slice(1);
        const sectionExists = document.getElementById(sectionId);
        
        // Only set if section doesn't exist (standalone page)
        if (!sectionExists) {
          setActiveSection(normalizedPath);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle initial hash and hash changes
  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.slice(1); // Remove #
      
      if (!hash) return;
      
      // Map hash to navigation href
      const hashMap: Record<string, string> = {
        'home': '/',
        'about': '/about',
        'services': '/services',
        'portfolio': '/work',
        'process': '/process',
        'contact': '/contact',
      };
      
      const href = hashMap[hash];
      if (href) {
        setActiveSection(href);
        
        // Scroll to section if it exists
        const section = document.getElementById(hash);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Check on mount
    updateFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', updateFromHash);
    
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, []);

  // Update underline position smoothly when active section changes
  useLayoutEffect(() => {
    const updateUnderlinePosition = () => {
      const activeLink = navLinksRef.current.get(activeSection);
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setUnderlineStyle({
          left: offsetLeft + offsetWidth * 0.2,
          width: offsetWidth * 0.6,
          opacity: 1,
        });
      }
    };

    // Try immediately
    updateUnderlinePosition();

    // Also try after a small delay if refs weren't ready
    const timer = setTimeout(updateUnderlinePosition, 50);
    
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 transition-[padding] duration-300 sm:px-6 lg:px-8">
      <nav
        aria-label={locale === "fa" ? "ناوبری اصلی" : "Main navigation"}
        className={cn(
          "mx-auto max-w-7xl rounded-full border px-6 py-3 transition-all duration-300 ease-out motion-reduce:transition-none",
          isScrolled
            ? "border-white/[0.08] bg-bg-void/75 backdrop-blur-[20px] shadow-glass-lift"
            : "border-transparent bg-transparent backdrop-blur-none"
        )}
        style={
          isScrolled
            ? {
                borderBottomWidth: "1px",
                borderBottomColor: "rgba(255, 255, 255, 0.08)",
              }
            : undefined
        }
      >
        <div
          className={cn(
            "flex items-center gap-6",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Logo Area - clickable unit linking to #home */}
          <a
            href={getSectionHref(locale, "/")}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void"
          >
            <LogoMark locale={locale} showText={true} />
          </a>

          {/* Navigation Links - Center with smooth sliding underline */}
          <div className="relative hidden flex-1 items-center justify-center gap-1 lg:flex">
            {site.navigation.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <SectionNavLink
                  key={item.href}
                  locale={locale}
                  href={item.href}
                  ref={(el: HTMLElement | null) => {
                    if (el) {
                      navLinksRef.current.set(item.href, el);
                    } else {
                      navLinksRef.current.delete(item.href);
                    }
                  }}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-primary motion-reduce:transition-none",
                    isActive
                      ? "font-medium text-white"
                      : "font-medium text-text-muted hover:text-text-primary"
                  )}
                >
                  {item[locale]}
                </SectionNavLink>
              );
            })}
            
            {/* Shared smooth sliding underline */}
            <span
              className="pointer-events-none absolute bottom-2 h-[2px] rounded-full bg-gradient-to-r from-cyan-primary via-violet-core to-magenta-glow transition-all duration-500 ease-out motion-reduce:transition-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
                opacity: underlineStyle.opacity,
              }}
            />
          </div>

          {/* Right Side Actions (left side on RTL) */}
          <div
            className={cn(
              "hidden items-center gap-3 sm:flex",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Language Toggle */}
            <a
              href={`/${otherLocale}`}
              hrefLang={otherLocale}
              className="rounded-full border border-glass-border bg-glass-bg px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-violet-core/70 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core motion-reduce:transition-none"
            >
              {otherLocale.toUpperCase()}
            </a>

            {/* CTA Button - links to #contact */}
            <SectionNavLink
              href="/contact"
              locale={locale}
              className="rounded-full bg-brand-beam px-5 py-2.5 text-sm font-bold text-bg-void shadow-magenta-glow transition hover:shadow-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void motion-reduce:transition-none"
            >
              {ctaLabel}
            </SectionNavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={
              isOpen
                ? locale === "fa"
                  ? "بستن فهرست"
                  : "Close menu"
                : menuLabel
            }
            className="inline-flex rounded-full border border-glass-border bg-glass-bg px-4 py-2 text-sm font-semibold text-text-primary lg:hidden"
          >
            {menuLabel}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-navigation"
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden motion-reduce:transition-none",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-4 grid gap-2 border-t border-glass-border pt-4">
              {site.navigation.map((item) => (
                <SectionNavLink
                  key={item.href}
                  locale={locale}
                  href={item.href}
                  onNavigate={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-text-muted hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {item[locale]}
                </SectionNavLink>
              ))}
              <a
                href={`/${otherLocale}`}
                hrefLang={otherLocale}
                className="rounded-2xl px-4 py-3 text-cyan-primary"
              >
                {otherLocale.toUpperCase()}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
