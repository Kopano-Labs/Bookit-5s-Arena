/**
 * Whin2 — RapidAPI-hosted WhatsApp send (scaffold).
 *
 * Set on Vercel / metal (never commit values):
 *   WHIN2_RAPIDAPI_KEY   — X-RapidAPI-Key
 *   WHIN2_RAPIDAPI_HOST  — e.g. whatsapp-api9.p.rapidapi.com from the API hub
 *   WHIN2_RAPIDAPI_URL   — full POST URL from the endpoint “Copy snippet” (includes path)
 *
 * Optional:
 *   WHIN2_EXTRA_JSON   — raw JSON merged into the POST body (same keys your API expects)
 *   WHIN2_BODY_STYLE   — ``phone_message`` (default) → ``{ phone, message }``;
 *                      ``to_text`` → ``{ to, text }`` (e.g. whin2.p.rapidapi.com)
 */

const KEY = process.env.WHIN2_RAPIDAPI_KEY?.trim();
const HOST = process.env.WHIN2_RAPIDAPI_HOST?.trim();
const URL = process.env.WHIN2_RAPIDAPI_URL?.trim();
const BODY_STYLE = (process.env.WHIN2_BODY_STYLE || "phone_message").trim();

function normalizeMsisdn(to) {
  const digits = String(to).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) {
    return `27${digits.slice(1)}`;
  }
  if (digits.startsWith("27")) return digits;
  return digits;
}

function buildWhin2Body(phoneDigits, message) {
  let extra = {};
  const raw = process.env.WHIN2_EXTRA_JSON?.trim();
  if (raw) {
    try {
      extra = JSON.parse(raw);
    } catch {
      extra = {};
    }
  }
  if (BODY_STYLE === "to_text") {
    return {
      to: phoneDigits,
      text: message,
      ...extra,
    };
  }
  return {
    phone: phoneDigits,
    message,
    ...extra,
  };
}

/**
 * @returns {Promise<{ success: boolean, provider: string, raw?: unknown, error?: string }>}
 */
export async function sendWhin2TextMessage({ to, message }) {
  const phoneDigits = normalizeMsisdn(to);
  if (!phoneDigits || !message) {
    return { success: false, provider: "whin2", error: "missing_phone_or_message" };
  }

  if (!KEY || !HOST || !URL) {
    return {
      success: false,
      provider: "whin2",
      error: "whin2_env_incomplete",
    };
  }

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": KEY,
      "X-RapidAPI-Host": HOST,
    },
    body: JSON.stringify(buildWhin2Body(phoneDigits, message)),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    return {
      success: false,
      provider: "whin2",
      error: `http_${res.status}`,
      raw: json,
    };
  }

  return { success: true, provider: "whin2", raw: json };
}

export function isWhin2Configured() {
  return Boolean(KEY && HOST && URL);
}
