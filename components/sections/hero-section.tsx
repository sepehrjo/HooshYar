import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionReveal } from "@/components/motion/section-reveal";
import {
  ButtonLink,
  Eyebrow,
  GradientText,
  Heading,
  Lead,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { siteContent } from "@/lib/site";
import type { Locale } from "@/types/locale";
import type { SiteContentData } from "@/lib/content/utils";
import { siteContent as defaultSiteContent } from "@/lib/site";

// Static video paths — served from /public/media/ by Next.js.
// Do NOT use fs.existsSync here; it fails on serverless platforms.
const HERO_VIDEO_MP4_SRC = "/media/hero-video.mp4";
const HERO_VIDEO_WEBM_SRC = "/media/hero-video.webm";
const HERO_POSTER_SRC = "/images/hero-poster.jpg";

function heroMediaReady() {
  // Can't check the filesystem on serverless, so trust the content status
  // from site-content.json. When status is "ready" the video files are
  // expected to exist in /public/media/.
  return siteContent.hero.status !== "placeholder-video";
}

function heroPosterSrc() {
  return "/images/hero-poster.jpg";
}

const iconPaths: Record<string, string> = {
  "ai-chip":
    "M16 10h16v28H16V10Zm-5 8h5m-5 6h5m-5 6h5m21-12h5m-5 6h5m-5 6h5M21 4v6m6-6v6m0 28v6m-6-6v6m1-25h10v10H22V19Z",
  workflow:
    "M12 15a5 5 0 1 0 0 .1M36 15a5 5 0 1 0 0 .1M24 36a5 5 0 1 0 0 .1M17 15h14M15 19l6 12m12-12-6 12",
  code: "M18 16 10 24l8 8m12-16 8 8-8 8M27 13l-6 22",
  cloud:
    "M14 32h20c4.5 0 8-3.2 8-7.4 0-4-3.2-7.2-7.3-7.4C33.4 12 29 8 23.7 8c-6.1 0-11 4.8-11.3 10.8C8.8 19.6 6 22.7 6 26.4 6 29.6 9 32 14 32Z",
};

const stats = [
  { value: 3, suffix: "+", en: "Core services", fa: "خدمت اصلی" },
  { value: 2, suffix: "", en: "Launch languages", fa: "زبان راه‌اندازی" },
  { value: 8, suffix: "", en: "Build phases", fa: "فاز ساخت" },
];

const glows = ["cyan", "magenta", "violet", "cyan"] as const;

const glowBeforeClasses = {
  cyan: "bg-cyan-primary/20 group-hover/moto-card:opacity-100",
  violet: "bg-violet-core/20 group-hover/moto-card:opacity-100",
  magenta: "bg-magenta-glow/20 group-hover/moto-card:opacity-100",
} as const;

function splitMotoLines(label: string, locale: Locale): string[] {
  if (locale === "fa" && label.includes("|BR|")) {
    return label
      .split("|BR|")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [label];
}

function LandingBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-deep-space"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-core/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-bg-void to-transparent"
      />
    </>
  );
}

function HeroVideoFrame({ locale }: { locale: Locale }) {
  const videoStatus = !heroMediaReady();
  const poster = heroPosterSrc();

  return (
    <div className="relative w-full overflow-hidden rounded-panel border border-glass-border bg-glass-bg shadow-glass-lift backdrop-blur-xl">
      <div className="relative aspect-video w-full">
        {videoStatus ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-deep-space"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-primary/20 bg-cyan-primary/10 blur-sm"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-core/20"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-magenta-glow/20"
            />
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-primary">
                {locale === "fa" ? "ویدئوی اصلی" : "Hero Video"}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">
                {locale === "fa"
                  ? "جایگاه ۱۶:۹ آماده دریافت ویدئوی اصلی است."
                  : "16:9 frame ready for the production hero video."}
              </p>
            </div>
          </>
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            {...(poster ? { poster } : {})}
          >
            <source src={HERO_VIDEO_WEBM_SRC} type="video/webm" />
            <source src={HERO_VIDEO_MP4_SRC} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

function MotoCard({
  icon,
  label,
  index,
  locale,
}: {
  icon: string;
  label: string;
  index: number;
  locale: Locale;
}) {
  const isFa = locale === "fa";
  const lines = splitMotoLines(label, locale);
  const glow = glows[index];

  return (
    <div
      className="group/moto-card moto-card-enter h-full motion-reduce:opacity-100"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={cn(
          "moto-card-shell relative flex h-full min-h-[11rem] flex-col overflow-hidden rounded-glass bg-glass-bg p-5 shadow-glass-lift backdrop-blur-xl transition duration-300 ease-premium group-hover/moto-card:bg-white/[0.055] motion-reduce:transition-none",
          isFa
            ? "items-center justify-center text-center"
            : "justify-center",
        )}
        style={{
          animationDelay: `0s, ${index * 0.65}s`,
        }}
      >
        {/* Animated gradient border - traveling gradient around perimeter */}
        <div
          className="moto-card-animated-border pointer-events-none absolute inset-0 rounded-glass"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-8 -top-16 h-32 rounded-full opacity-80 blur-3xl transition-opacity duration-300",
            glowBeforeClasses[glow],
          )}
        />
        {!isFa ? (
          <svg
            className="relative h-8 w-8 shrink-0 text-cyan-primary"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={iconPaths[icon]}
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        <p
          className={cn(
            "relative text-text-primary",
            isFa
              ? "font-heading text-xl font-bold leading-snug tracking-[-0.04em] md:text-2xl lg:text-[1.65rem]"
              : "mt-4 text-sm font-semibold leading-7",
          )}
          dir={isFa ? "rtl" : "ltr"}
        >
          {lines.map((line, lineIndex) => (
            <span
              key={`${index}-${lineIndex}`}
              className={lineIndex > 0 ? "mt-1 block" : "block"}
            >
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function LandingSection({
  locale,
  site = defaultSiteContent as SiteContentData,
}: {
  locale: Locale;
  site?: SiteContentData;
}) {
  const videoStatus = !heroMediaReady();
  const leftCards = [site.valueCards[0], site.valueCards[2]];
  const rightCards = [site.valueCards[1], site.valueCards[3]];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <LandingBackground />

      {videoStatus ? (
        <div className="absolute right-5 top-28 z-10 hidden rounded-full border border-glass-border bg-bg-void/70 px-4 py-2 font-mono text-xs text-text-muted backdrop-blur-xl md:block">
          DEV PLACEHOLDER · hero video pending
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-7xl">
        <SectionReveal>
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,15rem)] lg:gap-6 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,17rem)] xl:gap-8">
            <div className="hidden grid-rows-2 gap-4 lg:grid">
              {leftCards.map((card) => {
                const index = site.valueCards.indexOf(card);
                return (
                  <MotoCard
                    key={card.icon}
                    icon={card.icon}
                    label={card[locale]}
                    index={index}
                    locale={locale}
                  />
                );
              })}
            </div>

            <div className="w-full px-0 lg:px-2 xl:px-4">
              <HeroVideoFrame locale={locale} />
            </div>

            <div className="hidden grid-rows-2 gap-4 lg:grid">
              {rightCards.map((card) => {
                const index = site.valueCards.indexOf(card);
                return (
                  <MotoCard
                    key={card.icon}
                    icon={card.icon}
                    label={card[locale]}
                    index={index}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:hidden">
            {site.valueCards.map((card, index) => (
              <MotoCard
                key={card.icon}
                icon={card.icon}
                label={card[locale]}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

export function IntroHeroSection({ locale }: { locale: Locale }) {
  const hero = siteContent.hero[locale];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <LandingBackground />

      <div className="mx-auto w-full max-w-4xl">
        <SectionReveal className="mx-auto text-center">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Heading className="mt-6">
            {hero.headline.split(" ").slice(0, -2).join(" ")}{" "}
            <GradientText>
              {hero.headline.split(" ").slice(-2).join(" ")}
            </GradientText>
          </Heading>
          <Lead className="mx-auto mt-6 max-w-3xl">{hero.subhead}</Lead>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href={`/${locale}/contact`} size="lg">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/services`}
              variant="secondary"
              size="lg"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.en}
                className="rounded-3xl border border-glass-border bg-glass-bg p-4 backdrop-blur-xl"
              >
                <p className="font-heading text-2xl font-bold text-text-primary md:text-3xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs leading-5 text-text-muted md:text-sm">
                  {stat[locale]}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
