# Booking slot-claims migration

The booking API now records one lock per reserved court hour. The unique
`court_date_hour_unique` index prevents overlapping writes, while the booking
records remain the source of truth for customer status and payment.

Before enabling cancellation and rebooking against an existing database, run
the migration from a controlled environment connected to the intended database:

1. Take the normal database backup and confirm the target environment.
2. Run `npm run migrate:booking-slot-indexes` without `--apply`. This checks
   connectivity and reports malformed or overlapping active bookings without
   writing data.
3. Investigate any malformed or overlapping active legacy bookings. The apply
   run stops on conflicts and leaves the old unique start-time index in place.
4. Run `npm run migrate:booking-slot-indexes -- --apply`. The script backfills
   hourly claims and drops the old unique `{ court, date, start_time }` index
   only after every active booking was represented.
5. Verify the new unique hourly index and the active booking count before
   enabling the new code against that database.

The migration is repeatable after a partial run: existing matching claims are
accepted, while a conflicting claim stops the run. Do not run it against a
database whose inventory/calendar ownership is unknown. Never put the database
URI in a command line, commit, issue comment, or terminal output.

This migration does not create courts, assign rates, or import Setmore
inventory. The public booking journey must continue to show the empty-inventory
state until an organiser enters owner-verified courts and prices into Bookit.
