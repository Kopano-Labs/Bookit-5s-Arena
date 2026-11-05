# World Cup 5s 2026 — Source Archive

Status: archived public campaign

The public World Cup 5s event window was **29–31 May 2026** and registration closed **22 May 2026**. On 28 August 2026 the expired registration/live-event surfaces were retired from current public state.

This folder preserves the pre-archive UI source exactly as it existed at upstream baseline `fc29642d0b2794c8a47a4c5937add41827076ce9`. It is reference material only and is intentionally located under `STRUCTURE/`, which the repository already excludes from application lint/runtime concerns.

Preserved source:

- `registration-page.jsx` — former `/tournament` registration/payment UI.
- `TournamentSection.jsx` — former homepage World Cup campaign section.
- `TournamentShowcase.jsx` — former homepage live standings/fixtures showcase.
- `WelcomePopup.jsx` — former delayed registration campaign popup.
- `SoccerBallMenu.jsx` — former global menu with active tournament registration CTA.

The live API registration deadline gate remains in the application as a second safety boundary; archival work does not rewrite historical tournament records or delete the tournament data model.
