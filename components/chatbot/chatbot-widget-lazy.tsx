"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/types/locale";

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/chatbot-widget").then(mod => mod.ChatbotWidget),
  {
    ssr: false,
    loading: () => null,
  }
);

export { ChatbotWidget };

export function ChatbotWidgetLazy({ locale }: { locale: Locale }) {
  return <ChatbotWidget locale={locale} />;
}