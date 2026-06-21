# Bookit 5s Arena: Engineering Protocols & Procedures

## 🛡️ Protocol 01: Third-Party Data Integration
When adding a new sports data provider or league:
1. **Normalization First**: Never leak provider-specific naming conventions into the frontend. Map all keys to our internal `Match`, `Team`, and `Player` schemas.
2. **Environment Isolation**: Always use `FIRST_ENV` pattern to allow keys to be overridden per deployment environment.
3. **Empty States**: Every integration must provide a "Network Isolated" or "Data Unavailable" UI state to prevent total page failure.

## 🛡️ Protocol 02: Homepage Management
The homepage is the "Showroom". 
1. **Live Center Priority**: The `HomeLiveFixtures` section must always prioritize Live matches over completed ones.
2. **Performance Guardian**: All homepage data fetching MUST be asynchronous and should not block the initial hydration of the Hero section.
3. **Media Enrichment**: Only high-quality, verified reactor channels (AFTV, Stretford Paddock, etc.) should be used for auto-enrichment.

## 🛡️ Protocol 03: Scalability & The "Baby To Giant" Strategy
To ensure the foundation supports a 30-year growth span:
1. **Generic Implementation**: Components should accept `slugs` and `IDs` as props, not hardcoded strings.
2. **Dynamic Routing**: Use Next.js dynamic segments `[slug]` for all data-driven pages to avoid "The Page Explosion" (creating hundreds of static files).
3. **Audit Trail**: Every significant logic change must be documented in `STRUCTURE/07-Sessions By Day`.

## 🛡️ Procedure: Adding a New League
1. Update `LEAGUE_MAP` in `lib/sports/football.js` with the iSports ID.
2. Add the league to the `LEAGUES` constant in `app/fixtures/page.jsx`.
3. Verify the league logo URL is from a CDN with high availability.
4. Test the "News & Clips" tab to ensure YouTube search queries are fetching relevant highlights.
