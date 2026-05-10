import crypto from "node:crypto";

/**
 * Paystack webhook authenticity — HMAC-SHA512 of the **raw** request body.
 * @see https://paystack.com/docs/payments/webhooks
 *
 * @param {string} rawBody — ``await request.text()`` (do not parse JSON first)
 * @param {string | null} signature — ``x-paystack-signature`` header
 * @param {string} secret — ``PAYSTACK_SECRET_KEY`` (secret key, not public)
 * @returns {boolean}
 */
export function verifyPaystackSignature(rawBody, signature, secret) {
  if (!secret || typeof rawBody !== "string" || !signature) {
    return false;
  }
  const hash = crypto.createHmac("sha512", secret).update(rawBody, "utf8").digest("hex");
  if (hash.length !== signature.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "utf8"), Buffer.from(signature, "utf8"));
  } catch {
    return false;
  }
}
