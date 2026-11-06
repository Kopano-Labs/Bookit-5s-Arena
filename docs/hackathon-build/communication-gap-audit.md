# Why the supplied welcome/management email has no native equivalent

Source investigation: 20 October 2026. No account was created, booking submitted, notification sent or production data changed during this check. This is source/configuration evidence, not a delivery test.

## Customer evidence

The owner supplied a screenshot and pasted Fives Arena / Setmore account-welcome email. It thanks the customer for creating a profile, identifies the login email, advertises booking management/contact-profile updates/appointment history, links to the provider booking page, and displays venue contact/directions. This proves that this recipient received that profile welcome in the supplied evidence. It is not a booking confirmation, proof of a specific reservation, or proof the venue received a booking alert. Do not publish the customer's email/screenshot in the repository.

Required native outcome: Bookit account welcome with useful Bookit links; working profile/history/management; booking confirmation to the customer; an actionable booking receipt to the venue. Each is a separate event and acceptance check.

## Current source and configuration gaps

| Finding | Exact inspected source | What it establishes / limit |
|---|---|---|
| Credentials signup does not invoke a welcome sender | app/api/auth/register/route.js, User.create then 201 response | Native signup persists a User and returns success; no welcome dispatch on this path. Not a live signup test. |
| Social account creation also lacks a welcome dispatch | lib/authOptions.js, Google/Facebook User.create in JWT callback | A newly created social account has no account-welcome hook in this inspected code. Existing sign-ins must not receive repeated welcomes when repaired. |
| Profile and history were partially built | app/api/profile/route.js GET/PUT, app/profile/page.jsx, app/bookings/page.jsx, app/api/bookings/route.js GET | There is native profile persistence and a signed-in history query. These are existing assets to repair/reconnect, not features to claim absent wholesale. Contact-name/phone/preferences are supported in the API; runtime usability/access has not been established. |
| Guest booking saves without communicating | app/api/bookings/guest/route.js, Booking.create then 201 | No email/venue-alert dispatch on the current guest create path. PR #51 calls this path, so its current form does not fix communication by itself. |
| Guest history is not automatically account history | guest create leaves user null; GET /api/bookings filters user=session.user.id | A guest booking is not returned by that account-scoped query. Secure guest access/linking is required; never attach records merely by an unverified email match. Setmore account/history is also a separate store, not Bookit User/Booking data. |
| Signed-in email is a best-effort attempt with no durable delivery receipt | app/api/bookings/route.js and lib/sendBookingConfirmation.js / lib/messaging/bookingResendConfirmation.js | Customer email is attempted after save; exceptions are logged, and create still returns 201. This can be a valid persisted booking with failed communication, but current operational visibility/retry evidence is incomplete. It does not prove real email delivery. |
| Signed-in create does not fan out to venue | app/api/bookings/route.js after create | Inspected calls target the customer email and possibly customer phone, not a venue booking recipient. Earlier dispatcher below is absent from deployed lineage. |
| Existing messages can overstate reservation/payment state | create stores pending/reserved; current email says confirmed; Resend template labels total as Amount Paid | Source wording can claim confirmation/payment beyond stored facts. Repair status/amount-due copy alongside wiring. No production message reproduction is claimed. |
| WhatsApp simulation may look successful | lib/integrations/whatsapp.js | SIMULATION_MODE returns success:true with mode:simulation. That must never count as customer/venue delivery. Auth session callback also does not expose a phone field in the inspected mapping, while the route conditions WhatsApp on session.user.phone. |
| Production email variable names exist | Vercel filter_project_envs, decrypt=false | RESEND_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD and NEXTAUTH_URL have production targets. Values were not decrypted. Missing credentials cannot be assumed; sender verification, valid credentials and provider/inbox delivery remain untested. |

## Recovered earlier implementation

Git history contains merge `1be66aee21fb507028b97c3f2f1ab224c2b0d7aa`, dated 30 August 2026, message: "Merge pull request #14 from RobynAwesome/forge/booking-communications-contract — Implement booking communication receipts and WhatsApp default". The branch's live remote head on inspection was `73b7ce1a4f3979c370686e619ea36eeec943bc54`.

Inspected recoverable files at that merge:

- lib/bookings/dispatchBookingCommunications.js: persisted, revision-keyed customer/business delivery records, post-save dispatch and retry/duplicate-suppression logic.
- models/BookingDelivery.js: booking/revision/recipient/channel/purpose receipts with attempts, status and provider-message fields.
- lib/bookings/businessContacts.js: venue recipients.
- lib/messaging/bookingReservationEmail.js: reservation-oriented email implementation.
- Guest create at that commit calls createBookingWithOccupancy then dispatchBookingCommunications and returns communicationReceipts. The dispatcher schedules customer email and business email/WhatsApp plus the selected customer channel.
- scripts/validate-booking-communications-contract.mjs and related occupancy helpers provide salvage/test leads, not current passing-runtime proof.

Live source/deployment revalidation:

- `fivesarena.com`: Vercel production `dpl_BsHZ6xKnFTpgmjW4kSZwU2h7kjGv`, READY, Kopano-Labs/Bookit-5s-Arena main `85e6e2b4aa2035552c396d8e7d632a706e524f2d`.
- RobynAwesome main resolved to `977363c656bfc707ebbc3a086dfca01ba27eec8a`.
- `git merge-base --is-ancestor 1be66ae <each-main>` was false for both inspected current main tips; the dispatcher/BookingDelivery paths were absent in both trees. The earlier merged work exists in another history; it is not in either inspected current main.

This establishes a source-lineage/integration gap. It does not identify who removed/rebased the work, prove that it was ever live, or explain all historical missing data. Do not assert a removal cause without tracing the relevant branch transition.

## Recovery sequence and cautions

1. Preserve the earlier code and compare its dependencies/contracts against the current native APIs before porting. Do not cherry-pick the entire old application or overwrite unrelated current work.
2. Recover the customer/business dispatcher, durable receipts, truthful reservation copy and relevant tests; verify occupancy/lifecycle compatibility and bounded retry behavior.
3. Correct recipient configuration before use: the recovered business-contact default differs from the venue address in the owner-supplied email (missing the `s` in the venue name). Treat the supplied address as owner-provided business contact evidence; verify configuration/recipient ownership before any real send. Never silently restore the old default.
4. Add an idempotent, post-persistence account-welcome event for credentials and social signup. Include on-domain book/manage/profile/history and venue contact/directions links. No passwords, fake booking confirmation or provider-account cross-linking.
5. Exercise guest and signed-in reservation communication to allowlisted sandbox customer and venue recipients. Correlate saved record, receipt, provider result and actual inbox/management behavior. A simulation/sent receipt is not delivered/read proof.
6. Verify customer contact updates and history/management in fresh authorized sessions, with secure guest access and no cross-user leaks. Keep guest booking quick; account signup remains optional.

The checklist now explicitly includes this account-welcome/profile/history chain as R16 in addition to customer/venue booking communication R09. The prior native UI preview remains incomplete until these paths are repaired and evidenced.
