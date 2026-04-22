/**
 * Security utilities — Input sanitization, CSRF protection, and validation helpers.
 * Used across all API routes for production hardening.
 */

/**
 * Sanitize user input — strips HTML tags, null bytes, and control characters.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")                    // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control chars
    .replace(/<[^>]*>/g, "")               // Strip HTML tags
    .trim();
}

/**
 * Sanitize MongoDB query object — prevents NoSQL injection via $-operators.
 * @param {any} obj - Query object to sanitize
 * @returns {any} Clean object without $ operators
 */
export function sanitizeMongoQuery(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMongoQuery);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block MongoDB operators from user input
    if (key.startsWith("$")) continue;
    clean[key] = typeof value === "object" ? sanitizeMongoQuery(value) : value;
  }
  return clean;
}

/**
 * Validate email format.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Validate and sanitize a callback URL to prevent open redirects.
 * Only allows relative paths or same-origin URLs.
 * @param {string} url - The callback URL to validate
 * @param {string} origin - The allowed origin (e.g., "https://fivesarena.com")
 * @returns {string} Safe URL (defaults to "/" if invalid)
 */
export function safeCallbackUrl(url, origin = "") {
  if (!url || typeof url !== "string") return "/";
  
  // Allow relative paths
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  
  // Allow same-origin only
  try {
    const parsed = new URL(url);
    if (origin && parsed.origin === origin) return url;
  } catch {
    // Invalid URL
  }
  
  return "/";
}

/**
 * Strip sensitive fields from error responses.
 * Never expose stack traces or internal details to the client.
 * @param {string} message - Error message
 * @returns {string} Sanitized error message
 */
export function safeErrorMessage(message) {
  if (process.env.NODE_ENV === "production") {
    // In production, return generic messages for unexpected errors
    const safePatterns = [
      "not found", "unauthorized", "forbidden", "invalid", "required",
      "too many requests", "bad request", "conflict", "validation",
    ];
    const lower = (message || "").toLowerCase();
    if (safePatterns.some(p => lower.includes(p))) return message;
    return "An unexpected error occurred";
  }
  return message;
}

/**
 * Validate request origin for CSRF-like protection on custom API routes.
 * @param {Request} request
 * @returns {boolean} true if origin is trusted
 */
export function validateOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  
  const trustedOrigins = [
    "https://fivesarena.com",
    "https://www.fivesarena.com",
    "http://localhost:3000",
    "http://localhost:3002",
  ];
  
  // Allow requests without origin (same-origin, non-CORS)
  if (!origin) return true;
  
  return trustedOrigins.some(trusted => 
    origin === trusted || referer?.startsWith(trusted)
  );
}

/**
 * Generate security headers for API responses.
 * @returns {Object} Headers object
 */
export function apiSecurityHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}
