// app/api/chat/route.js
// Powers the ChatWidget — uses Claude claude-3-haiku-20240307 via direct API call
// Requires ANTHROPIC_API_KEY in .env.local

const SYSTEM_PROMPT = `You are the friendly AI assistant for 5s Arena, a 5-a-side football venue in Cape Town, South Africa.

About 5s Arena:
- Full name: 5s Arena at Hellenic Football Club
- Location: Pringle Rd, Milnerton, Cape Town 7441, South Africa
- Courts: Multiple floodlit, all-weather synthetic grass pitches
- Hours: 10:00 AM – 10:00 PM daily (every day)
- Pricing: From R400/hour (varies by court and time slot)
- Amenities: Bar & Restaurant, Sound System, Secure Parking, Floodlit courts, All-weather synthetic turf
- Events we host: Birthday parties, Tournaments (5v5), Corporate team-building events, Holiday football clinics for kids
- Contact: WhatsApp 063 782 0245 (Mashoto), Email: fivearena@mail.com
- Social media: Facebook (Fives Arena), Instagram @fivesarena, TikTok @fivesarena
- Website bookings: Users create an account, pick a court, choose date/time, and confirm the booking online

Your role:
- Answer questions about the venue concisely, warmly, and enthusiastically (football emojis welcome!)
- Keep answers short — 1–3 sentences max unless detail is genuinely needed
- If you're unsure about specific details (like exact packages or availability), direct them to WhatsApp: 063 782 0245
- Never make up pricing, policies or availability that isn't stated above
- Speak as if you love football and love this venue`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Invalid message.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return a fallback without crashing — chat still works via FAQ
      return Response.json(
        { error: 'AI service not configured. Please try WhatsApp for help.' },
        { status: 503 }
      );
    }

    // Build message history (last 8 exchanges for context)
    const messages = [
      ...(Array.isArray(history) ? history : []).slice(-8).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: String(m.content),
      })),
      { role: 'user', content: message },
    ];

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
      const err = await response.text();
      console.error('Anthropic API error:', response.status, err);
      return Response.json(
        { error: 'AI service temporarily unavailable.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text;

    if (!reply) {
      return Response.json({ error: 'No response from AI.' }, { status: 500 });
    }

    return Response.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
