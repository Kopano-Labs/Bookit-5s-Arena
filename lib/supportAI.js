// ── Local Support AI Engine (no API key needed) ──
// Rule-based support answers. This layer must not upgrade site-stated,
// cached, fallback, or historical information into verified-live business state.

const DIRECT_CONTACT = 'WhatsApp +27 63 782 0245 or email fivearena@gmail.com';

const KNOWLEDGE_BASE = {
  booking: {
    keywords: ['book', 'reserve', 'booking', 'slot', 'schedule', 'available', 'availability'],
    answer:
      'Use the Courts section on the home page for current online booking inventory. If the live court source is unavailable, 5s Arena will ask you to confirm the court, rate, and slot directly instead of showing fallback availability. You can also confirm via WhatsApp on +27 63 782 0245.',
  },
  cancel: {
    keywords: ['cancel', 'refund', 'cancellation', 'undo'],
    answer:
      'Use My Bookings for any cancellation action the current booking supports. Refund eligibility and cancellation terms are not guaranteed by this support bot; confirm the applicable policy for your booking with 5s Arena on WhatsApp before relying on a refund.',
  },
  price: {
    keywords: ['price', 'cost', 'rate', 'fee', 'how much', 'charge', 'rand', 'expensive', 'cheap', 'affordable'],
    answer:
      'Current court rates should come from the live booking inventory, not this support knowledge base. Check the Courts section for a source-backed rate; if no current rate is shown, confirm directly with 5s Arena on WhatsApp +27 63 782 0245.',
  },
  location: {
    keywords: ['location', 'address', 'where', 'directions', 'map', 'find', 'milnerton', 'cape town', 'hellenic'],
    answer:
      'The site lists 5s Arena at Hellenic Football Club, Pringle Rd, Milnerton, Cape Town 7441, South Africa. Use the map/directions link on the site for navigation.',
  },
  hours: {
    keywords: ['hours', 'open', 'close', 'time', 'operating', 'when', 'what time'],
    answer:
      'The site-stated reference hours are 10:00–22:00. That is not a real-time OPEN/CLOSED signal, so confirm current venue and slot availability through the booking source or WhatsApp before travelling.',
  },
  amenities: {
    keywords: ['amenities', 'facilities', 'parking', 'bar', 'restaurant', 'food', 'drink', 'toilet', 'shower', 'changing'],
    answer:
      'The site lists floodlit synthetic-turf facilities plus venue amenities including parking, a bar/restaurant, and a sound system. Treat amenity details as site-stated reference and confirm anything essential directly with the venue.',
  },
  rewards: {
    keywords: ['rewards', 'points', 'loyalty', 'tier', 'achievement', 'bronze', 'silver', 'gold', 'diamond', 'perk'],
    answer:
      'Use the Rewards page for the account-specific state currently recorded by the application. This support bot does not certify points, tier thresholds, discounts, or entitlements independently of that account/runtime state.',
  },
  referral: {
    keywords: ['referral', 'refer', 'invite', 'friend', 'share', 'code'],
    answer:
      'If your account currently exposes a referral feature, use the Rewards/Referrals surface for the recorded code and benefit rules. This support bot does not independently guarantee referral points or multi-level rewards.',
  },
  events: {
    keywords: ['event', 'birthday', 'corporate', 'party', 'tournament', 'function', 'team building'],
    answer:
      'The Events surface is an enquiry flow, not an automatic booking confirmation. Package descriptions are site-listed reference; the team must confirm the current date, scope, price, and any payment instructions before you pay.',
  },
  fixtures: {
    keywords: ['fixture', 'score', 'live', 'match', 'result', 'league', 'premier league', 'la liga'],
    answer:
      'Use the Fixtures/Match Center surfaces for football data. The UI distinguishes a current network response from a saved/cached snapshot; a saved snapshot must not be treated as a LIVE score just because an old status says live.',
  },
  account: {
    keywords: ['account', 'register', 'sign up', 'login', 'password', 'email', 'profile'],
    answer:
      'Use /login to sign in or /login?mode=register to create an account. Account access does not itself confirm that a court, event, league, price, or competition is currently available.',
  },
  payment: {
    keywords: ['payment', 'pay', 'card', 'cash', 'eft', 'bank', 'transfer', 'deposit'],
    answer:
      'Only follow payment instructions presented by the current transactional booking flow or confirmed directly by a 5s Arena human. This support bot does not certify card, cash, EFT, deposit, bank-detail, or payment-reference availability. Do not reuse the historical World Cup 2026 payment reference.',
  },
  tournament: {
    keywords: ['world cup', 'world cup 5s', 'nation', 'team spot', 'tournament registration'],
    answer:
      'The World Cup 5s 2026 public event window ran 29–31 May 2026 and registration closed 22 May 2026. The /tournament route is now an archive; for a new competition, ask the team what is currently open.',
  },
  contact: {
    keywords: ['contact', 'whatsapp', 'phone', 'call', 'email', 'reach', 'support', 'help'],
    answer: `Contact 5s Arena via ${DIRECT_CONTACT}. No response-time promise is made by this support bot.`,
  },
  rules: {
    keywords: ['rule', 'rules', 'regulation', 'no show', 'late', 'behaviour'],
    answer:
      'Use the Rules/Terms surface for the site-stated rules that apply to the service. If a rule affects a payment, cancellation, safety decision, or disputed booking, confirm it directly with 5s Arena before relying on this bot.',
  },
};

export function answerSupportQuestion(question) {
  const q = question.toLowerCase().trim();

  if (/^(hi|hello|hey|howzit|sup|morning|afternoon|evening)(\s|$|!)/.test(q)) {
    return {
      answer:
        'Hey! 👋 I can help navigate 5s Arena. For changing business facts such as prices, availability, payment instructions, or OPEN/LIVE status, I will point you to the current source or a human confirmation instead of guessing.',
      confidence: 'high',
    };
  }

  if (/^(thank|thanks|cheers|appreciate|ta)/.test(q)) {
    return {
      answer: "You're welcome! ⚽ If the next question depends on a current rate, slot, payment, or live match state, I'll keep the source boundary explicit.",
      confidence: 'high',
    };
  }

  const scores = Object.entries(KNOWLEDGE_BASE).map(([topic, data]) => {
    let score = 0;
    for (const keyword of data.keywords) {
      if (q.includes(keyword)) score += keyword.length;
    }
    return { topic, score, answer: data.answer };
  });

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score > 0) {
    if (scores[1] && scores[1].score > 0 && scores[0].score - scores[1].score < 3) {
      return {
        answer: `${scores[0].answer}\n\n${scores[1].answer}`,
        confidence: 'medium',
        topics: [scores[0].topic, scores[1].topic],
      };
    }
    return {
      answer: scores[0].answer,
      confidence: scores[0].score >= 8 ? 'high' : 'medium',
      topic: scores[0].topic,
    };
  }

  return {
    answer:
      `I do not have a verified answer for that from this local support knowledge base. I can help with booking navigation, source-qualified pricing/availability, the World Cup 2026 archive, fixtures, events, accounts, or contact details. For a changing business fact, confirm via ${DIRECT_CONTACT}.`,
    confidence: 'low',
  };
}

export const QUICK_QUESTIONS = [
  'How do I check current court availability?',
  'How do I verify the current rate?',
  'Where are you located?',
  'Is World Cup 5s 2026 still open?',
  'How do event enquiries work?',
  'How do I contact the team?',
];
