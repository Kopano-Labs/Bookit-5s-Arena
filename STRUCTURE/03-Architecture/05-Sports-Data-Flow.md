# Sports Data Architecture: Multi-League Engine

## 🏗️ Overview
The Bookit 5s Arena sports data engine is designed to be league-agnostic. It leverages a middleware library (`lib/sports/football.js`) to bridge third-party raw data providers with the high-fidelity React frontend.

## 🔗 Data Flow
1. **Request**: UI triggers a fetch to `/api/football/league/[slug]/matches`.
2. **Resolution**: `football.js` maps the `slug` to an iSports `leagueId`.
3. **Fetch**: `isports.js` calls the external API with the API key from environment variables.
4. **Normalization**: Raw data is transformed into the standard `Match` object:
   - `id`, `home`, `away`, `score`, `status` (Live/Finished), `kickoffTime`.
5. **Enrichment**:
   - `news.js` fetches RSS feeds (BBC, Sky, Goal).
   - `youtube.js` searches YouTube for `[Team Name] + [League] + Reaction` using RapidAPI.
6. **Rendering**: `FootballFixturesHub` displays the combined payload with glassmorphic UI.

## 🛠️ Key Components
- **`lib/sports/football.js`**: The central brain for sports logic.
- **`app/api/football/`**: Dynamic Next.js routes serving clean JSON to the client.
- **`components/fixtures/FootballFixturesHub.jsx`**: A reusable, tabbed UI that changes state based on league context.

## 📜 Supported Leagues
| Slug | ID | Competition |
| :--- | :--- | :--- |
| `premier-league` | 31 | English Premier League |
| `psl` | 272 | South African PSL |
| `la-liga` | 33 | Spanish La Liga |
| `serie-a` | 34 | Italian Serie A |
| `bundesliga` | 35 | German Bundesliga |
| `ligue-1` | 36 | French Ligue 1 |
| `uefa-champions-league` | 39 | UCL |

## ⚙️ Environment Dependences
- `ISPORTS_API_KEY`: Required for live scores.
- `YOUTUBE_RAPIDAPI_KEY`: Required for video highlights.
- `FOOTBALL_DATA_ORG_KEY`: (Alternative) used for some team logos.
