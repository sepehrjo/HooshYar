import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  JetBrains_Mono,
  Inter,
  Space_Grotesk,
  Vazirmatn,
} from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { NeuralBackground } from "@/components/background";
import { ChatbotWidgetLazy } from "@/components/chatbot/chatbot-widget-lazy";
import { CustomCursor, SmoothScrollProvider } from "@/components/effects";
import { ConditionalFooter, Navigation, SkipLink } from "@/components/layout";
import { getContentBundle } from "@/lib/content/loader";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import {
  isLocale,
  localeDirections,
  locales,
  type Locale,
} from "@/types/locale";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-persian",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fa";
  const title =
    locale === "fa"
      ? "هوش‌یار | خدمات هوش مصنوعی، اتوماسیون و توسعه وب"
      : "Hoosh Yar | AI Services, Automation, Web Development";
  const description =
    locale === "fa"
      ? "وب‌سایت دوزبانه و ممتاز هوش‌یار برای خدمات هوش مصنوعی، اتوماسیون و توسعه وب."
      : "A premium bilingual digital studio website for AI services, automation, and web development.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: locale === "fa" ? "%s | هوش‌یار" : "%s | Hoosh Yar",
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.png", type: "image/png" },
      ],
      apple: [
        { url: "/favicon.ico" },
      ],
    },
    openGraph: {
      title,
      description,
      siteName: "Hoosh Yar",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      type: "website",
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Hoosh Yar",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const messages = await getMessages();
  const direction = localeDirections[locale];
  const { site } = await getContentBundle();

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${spaceGrotesk.variable} ${inter.variable} ${vazirmatn.variable} ${jetBrainsMono.variable}`}
    >
      <body className={locale === "fa" ? "font-persian" : "font-body"}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <SkipLink
              label={
                locale === "fa" ? "رفتن به محتوای اصلی" : "Skip to main content"
              }
            />
            <CustomCursor />
            <NeuralBackground />
            <Navigation locale={locale} site={site} />
<div id="main-content" tabIndex={-1}>
               {children}
             </div>
             <ConditionalFooter locale={locale} site={site} />
             <ChatbotWidgetLazy locale={locale} />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
