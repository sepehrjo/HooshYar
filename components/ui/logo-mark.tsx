"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/locale";

const LOGO_SRC = "/images/Hoosh_Yar_Logo.jpeg";

function LogoFallback() {
  return (
    <svg
      className="relative h-12 w-12 text-cyan-primary"
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M14 28c-4-1-6.5-4.6-5.4-8.9 1-4 4.7-6 8.2-5.2 1.6-4.9 8.2-7 12.3-3.4 2.2 1.9 3 4.4 2.6 6.9 4.6.2 8 3.7 8 8.1 0 4.8-3.8 8.5-8.8 8.5H17.7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 28l7-7 6 6 6-10M23 21v15M29 27v9M16 28v8"
        stroke="url(#logo-gradient)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="28" r="2.4" fill="#3FE8F4" />
      <circle cx="23" cy="21" r="2.4" fill="#5B7FFF" />
      <circle cx="29" cy="27" r="2.4" fill="#9D5CFF" />
      <circle cx="35" cy="17" r="2.4" fill="#E63CD8" />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="12"
          y1="18"
          x2="38"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3FE8F4" />
          <stop offset="0.48" stopColor="#9D5CFF" />
          <stop offset="1" stopColor="#E63CD8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMark({
  className,
  locale = "fa",
  showText = true,
}: {
  className?: string;
  locale?: Locale;
  showText?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const label = locale === "fa" ? "هوش‌یار" : "Hoosh Yar";

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-label={label}
    >
      {/* Logo badge - 48px with violet glow */}
      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-glass-border bg-glass-bg backdrop-blur-xl">
        {/* Violet glow ring */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 20px rgba(157, 92, 255, 0.4)",
          }}
        />
        {!imageError ? (
          <Image
            src={LOGO_SRC}
            alt=""
            width={48}
            height={48}
            className="relative h-full w-full rounded-full object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <LogoFallback />
        )}
      </div>

      {/* Brand text with gradient - RTL gradient for Farsi */}
      {showText && (
        <span
          className={cn(
            "bg-clip-text text-[22px] leading-none text-transparent",
            locale === "fa" 
              ? "font-persian bg-gradient-to-l from-cyan-primary via-violet-core to-magenta-glow" 
              : "font-heading bg-gradient-to-r from-magenta-glow via-violet-core to-cyan-primary"
          )}
          style={{ fontWeight: 800 }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
