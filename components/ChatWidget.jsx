'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaWhatsapp, FaPaperPlane, FaFutbol } from 'react-icons/fa';

// ── Quick-answer FAQ (no API call needed) ──────────────────────
const FAQ = [
  { keys: ['price', 'cost', 'how much', 'rate', 'fee', 'rand', 'r400'], answer: 'Court bookings start from **R400/hour**. Prices vary by court and time slot — check the Book a Court section on the home page for exact pricing.' },
  { keys: ['where', 'location', 'address', 'find', 'directions', 'milnerton', 'cape town', 'hellenic'], answer: 'We\'re at **Hellenic Football Club, Pringle Rd, Milnerton, Cape Town 7441**. Click the map on our homepage for turn-by-turn directions!' },
  { keys: ['open', 'hours', 'time', 'when', 'close', 'operate'], answer: 'We\'re open **10:00 AM – 10:00 PM** every day. Floodlit courts mean you can play right up until closing time!' },
  { keys: ['book', 'reserve', 'booking', 'how to'], answer: 'Booking is easy! Create a free account (or log in), choose a court from the home page, pick your date & time, and confirm. Done — pitch is yours!' },
  { keys: ['birthday', 'party', 'parties', 'celebrate'], answer: '🎉 We LOVE birthday parties! Private court hire with full bar & clubhouse access, catering options available. WhatsApp **063 782 0245** for a tailored package.' },
  { keys: ['corporate', 'team build', 'company', 'office'], answer: '🏢 Corporate team-building days are our speciality. Courts + sound system + bar & restaurant = a day your team won\'t forget. Contact us for packages!' },
  { keys: ['tournament', 'league', 'competition'], answer: '🏆 Run your own 5v5 tournament with us! We supply the floodlit venue, sound system and bar. WhatsApp **063 782 0245** to organise.' },
  { keys: ['holiday', 'clinic', 'kids', 'coaching', 'school'], answer: '⚽ Holiday football clinics run during school holidays for all ages & skill levels. Great to keep kids active and improving. Contact us for upcoming dates.' },
  { keys: ['bar', 'food', 'restaurant', 'drink', 'eat'], answer: 'Yes! We have a fully licensed **bar & restaurant** on site. Perfect for celebrating after your game.' },
  { keys: ['park', 'parking', 'car'], answer: '🚗 Yes, we have **secure on-site parking** available for all players and guests.' },
  { keys: ['lights', 'floodlit', 'night', 'evening', 'dark'], answer: '💡 All courts are **fully floodlit** so evening games look and feel like a proper match.' },
  { keys: ['grass', 'surface', 'turf', 'pitch', 'artificial', 'synthetic'], answer: '🌿 All our pitches have **all-weather synthetic grass** — top quality, grippy, and playable in any conditions.' },
  { keys: ['cancel', 'refund', 'reschedule'], answer: 'For cancellations or rescheduling, please WhatsApp us at **063 782 0245** as soon as possible and we\'ll do our best to help.' },
  { keys: ['contact', 'phone', 'call', 'whatsapp', 'email', 'reach'], answer: 'Reach us on 📱 **WhatsApp: 063 782 0245** or 📧 **fivearena@mail.com**. We usually reply quickly!' },
  { keys: ['social', 'facebook', 'instagram', 'tiktok', 'follow'], answer: 'Follow us! 👉 **Facebook**: Fives Arena (search the page) · **Instagram** & **TikTok**: @fivesarena. Stay up to date with highlights, events & news.' },
];

const matchFAQ = (text) => {
  const lower = text.toLowerCase();
  for (const entry of FAQ) {
    if (entry.keys.some((k) => lower.includes(k))) return entry.answer;
  }
  return null;
};

// Render **bold** markdown in chat messages
const renderMessage = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
};

const WHATSAPP_URL = 'https://wa.me/27637820245';
const MAX_AI_ATTEMPTS = 3;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey! ⚽ Welcome to **5s Arena**. Ask me anything about bookings, pricing, events or our facilities — I\'m here to help!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAttempts, setAiAttempts] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);

    // Try FAQ first
    const faqAnswer = matchFAQ(text);
    if (faqAnswer) {
      setMessages([...updated, { role: 'assistant', content: faqAnswer }]);
      return;
    }

    // Escalate after max AI attempts
    const newAttempts = aiAttempts + 1;
    setAiAttempts(newAttempts);

    if (newAttempts > MAX_AI_ATTEMPTS || escalated) {
      setEscalated(true);
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content:
            'It looks like I\'m not able to answer that one for you 😅. Let me connect you with a real person — tap **Chat on WhatsApp** below and we\'ll sort you out immediately!',
          whatsapp: true,
        },
      ]);
      return;
    }

    // Call Claude AI
    setLoading(true);
    try {
      const history = updated
        .slice(-10) // last 10 messages for context
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...updated, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('no reply');
      }
    } catch {
      if (newAttempts >= MAX_AI_ATTEMPTS) {
        setEscalated(true);
        setMessages([
          ...updated,
          {
            role: 'assistant',
            content:
              'Hmm, I\'m having trouble with that one. No worries — tap **Chat on WhatsApp** and our team will help you straight away! 🤙',
            whatsapp: true,
          },
        ]);
      } else {
        setMessages([
          ...updated,
          {
            role: 'assistant',
            content:
              'Sorry, I didn\'t quite get that. Could you rephrase? Or try asking about pricing, booking, events or our location.',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: open ? '#374151' : '#16a34a',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(34,197,94,0.5)',
          transition: 'background 0.25s, box-shadow 0.25s, transform 0.25s',
          transform: open ? 'scale(0.92)' : 'scale(1)',
          animation: open ? 'none' : 'chatPulse 2.5s ease-in-out infinite',
        }}
      >
        {open
          ? <FaTimes style={{ color: '#fff', fontSize: '20px' }} />
          : <FaCommentDots style={{ color: '#fff', fontSize: '22px' }} />
        }
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            zIndex: 9999,
            width: 'min(380px, calc(100vw - 32px))',
            maxHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            background: '#111827',
            borderRadius: '16px',
            border: '1px solid rgba(75,85,99,0.6)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.1)',
            overflow: 'hidden',
            animation: 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #15803d, #166534)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FaFutbol style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '13px', margin: 0, lineHeight: 1.2 }}>
                5s Arena Assistant
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: 0 }}>
                Usually replies instantly
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '9px 13px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' ? '#15803d' : '#1f2937',
                    color: '#f9fafb',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(75,85,99,0.4)',
                  }}
                >
                  {renderMessage(msg.content)}
                  {msg.whatsapp && (
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '10px',
                        padding: '7px 14px',
                        background: '#25D366',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        textDecoration: 'none',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <FaWhatsapp size={14} /> Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '9px 14px',
                    borderRadius: '14px 14px 14px 4px',
                    background: '#1f2937',
                    border: '1px solid rgba(75,85,99,0.4)',
                    color: '#9ca3af',
                    fontSize: '13px',
                  }}
                >
                  Typing…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(75,85,99,0.4)',
              display: 'flex',
              gap: '8px',
              background: '#0f172a',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about pricing, booking, events…"
              style={{
                flex: 1,
                padding: '9px 12px',
                background: '#1f2937',
                border: '1px solid rgba(75,85,99,0.5)',
                borderRadius: '10px',
                color: '#f9fafb',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: input.trim() && !loading ? '#16a34a' : '#374151',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <FaPaperPlane style={{ color: '#fff', fontSize: '14px' }} />
            </button>
          </div>

          {/* WhatsApp always-visible footer link */}
          <div
            style={{
              padding: '8px 12px',
              background: '#0a0f1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderTop: '1px solid rgba(75,85,99,0.3)',
              flexShrink: 0,
            }}
          >
            <FaWhatsapp style={{ color: '#25D366', fontSize: '13px' }} />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#25D366',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
            >
              Prefer WhatsApp? Chat with a human → 063 782 0245
            </a>
          </div>
        </div>
      )}
    </>
  );
}
