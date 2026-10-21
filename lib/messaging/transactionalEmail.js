import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export function bookitOrigin() {
  const url = new URL(process.env.NEXTAUTH_URL || 'https://fivesarena.com');
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid Bookit origin');
  return url.origin;
}

/** A sandbox never falls through to real credentials or arbitrary SMTP hosts. */
export async function sendTransactionalEmail({ to, subject, html, idempotencyKey }) {
  const sandbox = process.env.BOOKIT_EMAIL_MODE === 'sandbox';
  if (!sandbox && process.env.BOOKING_COMMUNICATIONS_ENABLED !== 'true') {
    return { success: false, skipped: true, reason: 'Communications not enabled' };
  }
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { success: false, skipped: true, reason: 'Missing or invalid destination' };
  }
  const from = process.env.BOOKING_EMAIL_FROM || 'Bookit <bookings@fivesarena.com>';
  if (sandbox) {
    const allowed = (process.env.BOOKIT_TEST_EMAIL_ALLOWLIST || '').split(',').map(v => v.trim().toLowerCase());
    if (!allowed.includes(to.toLowerCase())) {
      return { success: false, skipped: true, reason: 'Destination outside sandbox allowlist' };
    }
    const port = Number(process.env.BOOKIT_TEST_SMTP_PORT);
    if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid sandbox SMTP port');
    const transport = nodemailer.createTransport({ host: '127.0.0.1', port, secure: false,
      connectionTimeout: 3000, socketTimeout: 5000, ignoreTLS: true });
    try {
      const info = await transport.sendMail({ from, to, subject, html });
      return { success: info.accepted?.length > 0, provider: 'sandbox-smtp', providerMessageId: info.messageId };
    } catch {
      return { success: false, uncertain: true, provider: 'sandbox-smtp', reason: 'SMTP outcome requires review' };
    } finally { transport.close(); }
  }
  // Choose one provider. An ambiguous result must not fall back and send twice.
  if (process.env.RESEND_API_KEY) {
    try {
      const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send(
        { from, to: [to], subject, html }, { idempotencyKey });
      if (error) return { success: false, provider: 'resend', reason: 'Provider rejected message' };
      return { success: Boolean(data?.id), provider: 'resend', providerMessageId: data?.id };
    } catch {
      return { success: false, uncertain: true, provider: 'resend', reason: 'Provider outcome requires review' };
    }
  }
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const transport = nodemailer.createTransport({ service: 'gmail', auth: {
      user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      connectionTimeout: 5000, socketTimeout: 10000 });
    try {
      const info = await transport.sendMail({ from: process.env.GMAIL_USER, to, subject, html });
      return { success: info.accepted?.length > 0, provider: 'gmail', providerMessageId: info.messageId };
    } catch {
      return { success: false, uncertain: true, provider: 'gmail', reason: 'SMTP outcome requires review' };
    } finally { transport.close(); }
  }
  return { success: false, skipped: true, reason: 'No email provider configured' };
}
