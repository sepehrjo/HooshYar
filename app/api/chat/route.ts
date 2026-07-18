import Groq from "groq-sdk";
import { knowledge } from "@/lib/knowledge";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0]!.trim() : 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return Response.json({ reply: null, error: "too_many_requests" }, { status: 429 });
    }

    // ✅ Check API key BEFORE initializing Groq
    if (!process.env.GROQ_API_KEY) {
      console.error("[CHAT] GROQ_API_KEY not set or empty");
      return Response.json(
        { reply: null, error: "service_unavailable" },
        { status: 503 }
      );
    }

    // ✅ Groq initialized INSIDE handler, not at module level
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const { message, locale, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ reply: null, error: "failed" }, { status: 400 });
    }

    const sanitized = message.replace(/<[^>]*>/g, "").slice(0, 500);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are the AI assistant for Hoosh Yar. Use only the information below to answer questions. Respond in the same language the user writes in. Be concise, warm, and helpful. Never invent information not in the knowledge base.\n\n${knowledge}`,
        },
        {
          role: "user",
          content: sanitized,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Log to KV (non-blocking, silent fail)
    if (sessionId && typeof sessionId === "string" && reply) {
      try {
        const { saveChatSession } = await import("@/lib/kv");
        await saveChatSession(sessionId, locale || "en", sanitized, reply);
      } catch {
        /* silent fail */
      }
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ reply: null, error: "failed" }, { status: 500 });
  }
}
