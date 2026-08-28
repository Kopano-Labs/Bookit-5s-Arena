export const dynamic = 'force-dynamic';
// app/api/chat/route.js
// AI Chatbot fallback chain:
//   1. Groq
//   2. Anthropic
//   3. Rule-based local engine

import { answerSupportQuestion } from '@/lib/supportAI';
import { verifyBotRequest } from '@/lib/security/botid';
import { logBraintrustEvent } from '@/lib/integrations/braintrust';
import { rateLimit } from '@/lib/rateLimit';

const SYSTEM_PROMPT = `You are the support assistant for 5s Arena, a 5-a-side football service associated with Hellenic Football Club in Milnerton, Cape Town.

SOURCE GOVERNANCE — this is mandatory:
- Never turn configured, cached, fallback, historical, or site-stated information into VERIFIED-LIVE or TRANSACTIONAL state without a current authoritative receipt.
- Prices, court availability, slot availability, payment methods, payment references, refund/cancellation terms, opening-now status, event-package scope, prizes, jobs, and current competition registration are changing business facts. Do not guess them.
- For current court inventory/rates, direct users to the Courts section. If the booking source is unavailable, tell them to confirm with a 5s Arena human.
- The site-stated reference hours are 10:00–22:00, but that is not a real-time OPEN/CLOSED signal. Tell users to confirm current availability before travelling when it matters.
- The World Cup 5s 2026 event window ran 29–31 May 2026 and registration closed 22 May 2026. /tournament is an archive. Never say registrations are open, never quote the historical entry fee as a current fee, and never issue/reuse a World Cup payment reference.
- Fixture data can come from a current network response or a saved/cached snapshot. A snapshot must not be described as LIVE. Tell users to rely on the source-state label shown by the fixture UI.
- Event requests are enquiries until a human confirms date, package scope, price, and payment instructions.
- Contact: WhatsApp +27 63 782 0245; email fivearena@gmail.com.
- Location listed by the site: Hellenic Football Club, Pringle Rd, Milnerton, Cape Town 7441, South Africa.

COMMUNICATION:
- Keep answers concise and helpful.
- State the evidence class when relevant: current booking source, site-stated reference, saved snapshot, archive, or human confirmation required.
- If you cannot validate a changing business fact, say that clearly and direct the user to WhatsApp +27 63 782 0245 rather than inventing an answer.
- Navigational URLs can be mentioned as routes, but the existence of a route is not proof that a feature, job, league, payment rail, or live event is currently active.`;

function buildMessages(history, message) {
  return [
    ...(Array.isArray(history) ? history : []).slice(-8).map((item) => ({
      role: item.role === 'user' ? 'user' : 'assistant',
      content: String(item.content),
    })),
    { role: 'user', content: message },
  ];
}

async function tryGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 400,
      temperature: 0.3,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) {
    console.warn('Groq API error:', response.status);
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

async function tryClaude(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    console.warn('Anthropic API error:', response.status);
    return null;
  }

  const data = await response.json();
  return data?.content?.[0]?.text ?? null;
}

function tryRuleBased(message) {
  const result = answerSupportQuestion(message);
  return result.answer;
}

export async function POST(request) {
  const botVerification = await verifyBotRequest();
  if (botVerification.isBot) {
    return Response.json({ error: 'Automated chat abuse is blocked.' }, { status: 403 });
  }

  const ip =
    request.headers
      .get('x-forwarded-for')
      ?.split(',')[0]
      ?.trim() || 'unknown';
  if (rateLimit(ip, 10, 60000)) {
    return Response.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Invalid message.' }, { status: 400 });
    }

    if (message.length > 1000) {
      return Response.json(
        { error: 'Message is too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    const messages = buildMessages(history, message);

    let reply = await tryGroq(messages);
    let provider = 'groq';

    if (!reply) {
      reply = await tryClaude(messages);
      provider = 'claude';
    }

    if (!reply) {
      reply = tryRuleBased(message);
      provider = 'local';
    }

    if (!reply) {
      return Response.json({ error: 'AI service temporarily unavailable.' }, { status: 503 });
    }

    void logBraintrustEvent({
      input: {
        route: '/api/chat',
        provider,
        message,
      },
      output: {
        reply,
      },
      metadata: {
        category: 'support-chat',
        provider,
        governance: 'source-qualified-business-claims',
      },
      scores: {
        response_length: reply.length,
      },
    });

    return Response.json({ reply, provider });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
