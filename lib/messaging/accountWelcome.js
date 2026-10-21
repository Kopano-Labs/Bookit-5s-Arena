import AccountWelcomeDelivery from '../../models/AccountWelcomeDelivery.js';
import { runDurableDelivery } from './durableDelivery.js';
import { bookitOrigin, escapeHtml, sendTransactionalEmail } from './transactionalEmail.js';

export async function sendAccountWelcome(user) {
  return runDurableDelivery({ Model: AccountWelcomeDelivery, key: { user: user._id },
    recipientAddress: user.email, send: id => sendTransactionalEmail({ to: user.email,
      idempotencyKey: `welcome-${id}`, subject: 'Welcome to Fives Arena',
      html: `<h1>Welcome, ${escapeHtml(user.name)}</h1><p>Your Bookit profile is ready.</p>
        <p><a href="${bookitOrigin()}/book">Book a court</a></p>
        <p><a href="${bookitOrigin()}/bookings">Your bookings</a> ·
        <a href="${bookitOrigin()}/profile">Your profile</a> ·
        <a href="${bookitOrigin()}/contact">Contact Fives Arena</a></p>` }) });
}

// A saved account must not look failed because its notification could not queue.
export async function notifyNewAccount(user) {
  try { return await sendAccountWelcome(user); }
  catch { console.error('[WELCOME_RECEIPT_PENDING]'); return { status: 'pending' }; }
}
