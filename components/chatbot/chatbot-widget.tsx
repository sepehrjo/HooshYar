"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/types/locale";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotWidgetProps {
  locale: Locale;
}

const PLACEHOLDER_RESPONSES = {
  fa: "ممنون از پیامتون. به زودی این بخش به هوش مصنوعی متصل می‌شه.\nتا اون موقع، از فرم تماس استفاده کنید.",
  en: "Thanks for your message. This section will be connected to AI soon.\nIn the meantime, please use the contact form.",
};

const QUICK_REPLIES = {
  fa: [
    "خدمات هوش‌یار چیه؟",
    "قیمت‌ها چطوره؟",
    "می‌خوام پروژه بدم",
  ],
  en: [
    "What services do you offer?",
    "How does pricing work?",
    "I want to start a project",
  ],
};

const WELCOME_TEXT = {
  fa: {
    greeting: "سلام! من دستیار هوش‌یار هستم.",
    question: "چطور می‌تونم کمکتون کنم؟",
  },
  en: {
    greeting: "Hi! I'm the Hoosh Yar assistant.",
    question: "How can I help you today?",
  },
};

const ONLINE_LABEL = {
  fa: "آنلاین",
  en: "Online",
};

const BRAND_TEXT = {
  fa: "هوش‌یار",
  en: "Hoosh Yar",
};

const CURVED_TEXT = {
  fa: "گفتگو با هوش‌یار",
  en: "Talk to Hoosh Yar",
};

const CHAT_SESSION_KEY = "hoosh-yar-chat-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(CHAT_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(CHAT_SESSION_KEY, id);
  }
  return id;
}

export function ChatbotWidget({ locale }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const getNextId = () => `msg-${++idCounterRef.current}`;

  // Entrance animation delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: getNextId(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          locale: locale,
          sessionId: getOrCreateSessionId(),
        }),
      });

      const data = await response.json();

      // Add bot response
      const botMessage: Message = {
        id: getNextId(),
        text: data.reply || data.error || PLACEHOLDER_RESPONSES[locale],
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Fallback error message
      const errorMessage: Message = {
        id: getNextId(),
        text:
          locale === "fa"
            ? "مشکلی پیش اومد. لطفاً از فرم تماس استفاده کنید."
            : "Something went wrong. Please use the contact form.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const isRTL = locale === "fa";

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="chatbot-trigger-container"
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              width: "120px",
              height: "120px",
              zIndex: 9999,
            }}
          >
            {/* Curved Text SVG - Full Wrapper */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            >
              <defs>
                {/* Brand gradient for text */}
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#3FE8F4", stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: "#9D5CFF", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#E63CD8", stopOpacity: 1 }} />
                </linearGradient>

                {/* Circular arc path - button is at bottom, so arc center is at (60, 92) */}
                {/* Button center: x=60 (middle), y=92 (120-28, where 28 is half of 56px button) */}
                <path
                  id="textArc"
                  d="M 20,92 A 40,40 0 0,1 100,92"
                  fill="none"
                />
              </defs>

              {/* Locale-aware curved text */}
              <text
                fill="url(#textGradient)"
                fontSize="10"
                fontWeight="600"
                fontFamily={locale === "fa" ? "var(--font-persian), Vazirmatn, sans-serif" : "var(--font-heading), sans-serif"}
                textAnchor="middle"
                className="curved-text"
                style={{
                  opacity: 0.85,
                  transition: "opacity 0.2s ease",
                }}
              >
                <textPath
                  href="#textArc"
                  startOffset="50%"
                  style={{
                    direction: isRTL ? "rtl" : "ltr",
                    unicodeBidi: isRTL ? "bidi-override" : "normal",
                  }}
                >
                  {CURVED_TEXT[locale]}
                </textPath>
              </text>
            </svg>

            {/* Button positioned at bottom-center of wrapper */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {/* Radar Ping Effect */}
              <div
                className="radar-ping"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "56px",
                  height: "56px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid rgba(63,232,244,0.3)",
                    animation: "radar-ping 4s ease-out infinite",
                  }}
                />
              </div>

              {/* Orbiting Particles */}
              <div
                className="orbit-container"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "80px",
                  height: "80px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                {/* Cyan particle - 8s orbit */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "80px",
                    height: "80px",
                    animation: "orbit-clockwise 8s linear infinite",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      width: "4px",
                      height: "4px",
                      marginLeft: "-2px",
                      marginTop: "-2px",
                      borderRadius: "50%",
                      backgroundColor: "#3FE8F4",
                      opacity: 0.7,
                      boxShadow: "0 0 4px rgba(63,232,244,0.6)",
                    }}
                  />
                </div>

                {/* Magenta particle - 11s orbit (opposite direction) */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "80px",
                    height: "80px",
                    animation: "orbit-counterclockwise 11s linear infinite",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      width: "4px",
                      height: "4px",
                      marginLeft: "-2px",
                      marginTop: "-2px",
                      borderRadius: "50%",
                      backgroundColor: "#E63CD8",
                      opacity: 0.7,
                      boxShadow: "0 0 4px rgba(230,60,216,0.6)",
                    }}
                  />
                </div>
              </div>

              {/* Main Trigger Button */}
              <motion.button
                animate={{ 
                  y: [0, 0, -6, 0],
                }}
                transition={{ 
                  y: { 
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                    delay: 0.3,
                  }
                }}
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-trigger"
                aria-label={
                  isOpen
                    ? locale === "fa"
                      ? "بستن چت"
                      : "Close chat"
                    : locale === "fa"
                      ? "باز کردن چت"
                      : "Open chat"
                }
                style={{
                  position: "relative",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s ease",
                  overflow: "hidden",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient border */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #3FE8F4, #9D5CFF, #E63CD8, #3FE8F4)",
                    animation: "spin 4s linear infinite",
                    zIndex: -1,
                  }}
                />

                {/* Robot Icon */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/images/chatbot.png"
                    alt="Chatbot"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Close indicator when open */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="chatbot-panel"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "32px",
              width: "380px",
              height: "560px",
              maxWidth: "calc(100vw - 64px)",
              maxHeight: "calc(100vh - 132px)",
              zIndex: 9998,
              background: "rgba(5,6,15,0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              boxShadow: "0 0 40px rgba(157,92,255,0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-center gap-2">
                {/* Robot Icon */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#9D5CFF]/40">
                  <Image
                    src="/images/chatbot.png"
                    alt="Chatbot"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Brand Text */}
                <span
                  className={`text-base font-bold bg-gradient-to-${isRTL ? "l" : "r"} from-[#E63CD8] via-[#9D5CFF] to-[#3FE8F4] bg-clip-text text-transparent ${
                    locale === "fa" ? "font-persian" : "font-heading"
                  }`}
                >
                  {BRAND_TEXT[locale]}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Online Status */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3FE8F4] animate-pulse" />
                  <span className="text-xs text-[#8A91B0]">
                    {ONLINE_LABEL[locale]}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#8A91B0] hover:text-[#F2F4FF] transition-colors"
                  aria-label={locale === "fa" ? "بستن" : "Close"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.2) transparent",
              }}
            >
              {messages.length === 0 ? (
                // Welcome State
                <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
                  {/* Robot Icon with Glow */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-4 ring-[#9D5CFF]/40">
                    <Image
                      src="/images/chatbot.png"
                      alt="Chatbot"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Welcome Text */}
                  <div className="text-center space-y-2">
                    <p className="text-[#F2F4FF] text-base font-medium">
                      {WELCOME_TEXT[locale].greeting}
                    </p>
                    <p className="text-[#8A91B0] text-sm">
                      {WELCOME_TEXT[locale].question}
                    </p>
                  </div>

                  {/* Quick Reply Chips */}
                  <div className="flex flex-col gap-2 w-full max-w-[280px]">
                    {QUICK_REPLIES[locale].map((text, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleQuickReply(text)}
                        className="group px-4 py-2.5 text-sm text-[#F2F4FF] bg-transparent border border-[rgba(255,255,255,0.12)] rounded-full hover:border-[#3FE8F4] hover:bg-[rgba(63,232,244,0.08)] transition-all"
                      >
                        {text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                // Messages
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      locale={locale}
                    />
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && <TypingIndicator locale={locale} />}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    locale === "fa"
                      ? "پیام خود را بنویسید..."
                      : "Type your message..."
                  }
                  dir={isRTL ? "rtl" : "ltr"}
                  className="flex-1 px-4 py-2.5 text-sm text-[#F2F4FF] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl focus:outline-none focus:border-[rgba(63,232,244,0.4)] focus:ring-2 focus:ring-[rgba(63,232,244,0.2)] transition-all placeholder:text-[#8A91B0]"
                  style={{
                    fontFamily: locale === "fa" ? "var(--font-persian)" : "inherit",
                  }}
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#3FE8F4] to-[#E63CD8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-opacity hover:opacity-90"
                  aria-label={locale === "fa" ? "ارسال" : "Send"}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      transform: isRTL ? "rotate(180deg)" : "none",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyframes for animations */}
      <style jsx>{`
        .chatbot-trigger-container:hover .curved-text {
          opacity: 1 !important;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes radar-ping {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes orbit-clockwise {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes orbit-counterclockwise {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .chatbot-trigger,
          .chatbot-panel,
          .radar-ping,
          .orbit-container,
          .curved-text {
            transition: none !important;
            animation: none !important;
          }
          .curved-text {
            opacity: 0.85 !important;
          }
          .radar-ping > div,
          .orbit-container > div {
            animation: none !important;
          }
        }

        @media (max-width: 640px) {
          .chatbot-panel {
            width: 100vw !important;
            height: 70vh !important;
            bottom: 0 !important;
            right: 0 !important;
            max-width: 100vw !important;
            border-radius: 20px 20px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  locale,
}: {
  message: Message;
  locale: Locale;
}) {
  const isBot = message.sender === "bot";
  const isRTL = locale === "fa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2 ${
        isBot
          ? isRTL
            ? "flex-row-reverse"
            : "flex-row"
          : isRTL
            ? "flex-row"
            : "flex-row-reverse"
      }`}
    >
      {/* Avatar (only for bot) */}
      {isBot && (
        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/images/chatbot.png"
            alt="Bot"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm whitespace-pre-wrap ${
          isBot
            ? "bg-[rgba(255,255,255,0.06)] text-[#F2F4FF]"
            : "bg-gradient-to-br from-[rgba(63,232,244,0.12)] to-[rgba(157,92,255,0.12)] border border-[rgba(157,92,255,0.25)] text-[#F2F4FF]"
        }`}
        style={{
          borderRadius: isBot
            ? isRTL
              ? "16px 16px 4px 16px"
              : "16px 16px 16px 4px"
            : isRTL
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
        }}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

// Typing Indicator Component
function TypingIndicator({ locale }: { locale: Locale }) {
  const isRTL = locale === "fa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src="/images/chatbot.png"
          alt="Bot"
          fill
          className="object-cover"
        />
      </div>

      {/* Typing Dots */}
      <div
        className="px-4 py-3 bg-[rgba(255,255,255,0.06)]"
        style={{
          borderRadius: isRTL ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#3FE8F4]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
