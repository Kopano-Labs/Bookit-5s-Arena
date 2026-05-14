import type { Page } from "@playwright/test";

export async function seedFixturesVaultSnapshot(
  page: Page,
  {
    leagueSlug = "la-liga",
    season = new Date().getFullYear(),
  }: { leagueSlug?: string; season?: number } = {},
) {
  const matchesPayload = {
    groups: [
      {
        dateKey: "vault",
        dateLabel: "Saved window",
        matches: [
          {
            id: "vault-match-1",
            kickoffLabel: "18:30",
            weekLabel: "Week 1",
            competitionPhase: "League",
            status: { state: "scheduled", short: "NS" },
            home: { name: "Vault Home", shortName: "VH", logo: null },
            away: { name: "Vault Away", shortName: "VA", logo: null },
            score: { home: null, away: null },
            venue: "Saved Stadium",
          },
        ],
      },
    ],
  };

  const metaPayload = {
    league: {
      slug: leagueSlug,
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png",
    },
    selectedSeason: season,
    seasonOptions: [
      {
        year: season,
        label: `${season}-${String(season + 1).slice(-2)}`,
      },
    ],
  };

  await page.addInitScript(
    ({ leagueSlug: slug, season: seasonYear, matchesPayload: matches, metaPayload: meta }) => {
      const matchesKey = `football:${slug}:matches:${seasonYear}`;
      const metaKey = `football:${slug}:meta:current`;

      const snapshots = [
        {
          cacheKey: matchesKey,
          resource: "matches",
          leagueSlug: slug,
          season: seasonYear,
          payload: matches,
          lastUpdated: Date.now(),
          staleAfterMs: 300_000,
          source: "vault",
        },
        {
          cacheKey: metaKey,
          resource: "meta",
          leagueSlug: slug,
          season: null,
          payload: meta,
          lastUpdated: Date.now(),
          staleAfterMs: 3_600_000,
          source: "vault",
        },
      ];

      const request = indexedDB.open("kopano_vault", 3);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("fixtures_snapshots")) {
          db.createObjectStore("fixtures_snapshots", { keyPath: "cacheKey" });
        }
        if (!db.objectStoreNames.contains("vault_state")) {
          db.createObjectStore("vault_state", { keyPath: "key" });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("fixtures_snapshots", "readwrite");
        const store = tx.objectStore("fixtures_snapshots");
        for (const snapshot of snapshots) {
          store.put(snapshot);
        }
      };
    },
    { leagueSlug, season, matchesPayload, metaPayload },
  );
}

export async function seedFeaturedVaultSnapshot(page: Page) {
  await page.addInitScript(() => {
    const snapshot = {
      cacheKey: "football:global:featured:current",
      resource: "featured",
      leagueSlug: "global",
      season: null,
      payload: [
        {
          id: "featured-1",
          kickoffLabel: "20:00",
          home: { name: "Featured Home", shortName: "FH" },
          away: { name: "Featured Away", shortName: "FA" },
          status: { state: "scheduled", short: "NS" },
        },
      ],
      lastUpdated: Date.now(),
      staleAfterMs: 120_000,
      source: "vault",
    };
    const request = indexedDB.open("kopano_vault", 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("fixtures_snapshots")) {
        db.createObjectStore("fixtures_snapshots", { keyPath: "cacheKey" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("fixtures_snapshots", "readwrite");
      tx.objectStore("fixtures_snapshots").put(snapshot);
    };
  });
}
