# Chatbot Integration

AI-powered chatbot widget using Groq API.

## Setup

1. Get API key from: https://console.groq.com/
2. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Run: `npm run dev`

## Features

- Bilingual support (English/Persian)
- Auto-detects user language
- Responds based on knowledge base
- Glassmorphic design matching site
- Full RTL support

## Configuration

**API Route:** `/app/api/chat/route.ts`
- Model: `llama-3.1-8b-instant`
- Max tokens: 300
- Temperature: 0.7

**Knowledge Base:** `/content/knowledge/HOOSH-YAR-knowledge.txt`

**Widget:** `/components/chatbot/chatbot-widget.tsx`

## Development

```bash
npm run dev
```

Test at: http://localhost:3000
