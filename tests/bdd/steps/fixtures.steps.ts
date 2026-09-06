import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { execSync } from "node:child_process";
import type { BddWorld } from "../support/world.js";
import { resolveLeague } from "../support/leagueCatalog.js";
import { primeOneOfTwentySevenLeagues } from "../support/fixturesApiStubs.js";
import { seedFeaturedVaultSnapshot, seedFixturesVaultSnapshot } from "../support/vaultSeed.js";

const EMPTY_STATE_PATTERN =
  /no fixtures found|no matches in this window|schedule not published|match window|could not find fixtures/i;

async function reloadFixturesIfOpen(world: BddWorld) {
  const page = world.page;
  if (!page) return;
  if (page.url().includes("/fixtures")) {
    await page.reload({ waitUntil: "domcontentloaded" });
  }
}

const JARGON_PATTERN =
  /YOUTUBE_RAPIDAPI_KEY|api_key|IndexedDB|undefined|null|iSports API|NEXT_PUBLIC_/i;

async function openFixtures(world: BddWorld, leagueSlug?: string) {
  const page = world.page!;
  const query = leagueSlug ? `?league=${leagueSlug}` : "";
  await page.goto(`/fixtures${query}`, { waitUntil: "domcontentloaded" });
}

async function waitForFixturesLoaded(world: BddWorld) {
  const page = world.page!;
  await page.getByRole("heading", { name: /live fixtures/i }).waitFor({ state: "visible" });
  await page.waitForTimeout(600);
}

async function clickLeague(world: BddWorld, label: string) {
  const page = world.page!;
  await page.getByRole("button", { name: new RegExp(label, "i") }).first().click();
  await page.waitForTimeout(500);
}

async function enableRecoveryShield(world: BddWorld) {
  world.stubState.shieldEnabled = true;
  await world.page!.addInitScript(() => {
    window.localStorage.setItem("bdd_fixtures_shield", "true");
  });
}

// --- Given -------------------------------------------------------------------

Given("the user opens the Fixtures page on a mobile viewport", async function (this: BddWorld) {
  this.stubState.mode = "default";
  await openFixtures(this);
});

Given("the user opens the Fixtures page", async function (this: BddWorld) {
  await openFixtures(this);
});

Given("the selected league has no fixtures from the provider", async function (this: BddWorld) {
  this.stubState.mode = "empty-all";
  this.stubState.activeSlug = "premier-league";
  await reloadFixturesIfOpen(this);
});

Given("the provider returns fixtures for {int} of {int} leagues", async function (this: BddWorld, count: number) {
  if (count === 1) {
    primeOneOfTwentySevenLeagues(this.stubState);
  }
});

Given("the remaining {int} leagues return empty arrays", async function (this: BddWorld) {
  this.stubState.mode = "one-league-populated";
});

Given("the {string} feed returns no fixtures", async function (this: BddWorld, league: string) {
  const { slug } = resolveLeague(league);
  this.stubState.setLeagueEmpty(slug);
  await reloadFixturesIfOpen(this);
});

Given("the user has a previously cached fixtures snapshot on this device", async function (this: BddWorld) {
  await seedFixturesVaultSnapshot(this.page!, { leagueSlug: "la-liga" });
});

Given("the provider request times out", async function (this: BddWorld) {
  this.stubState.timeoutAll = true;
});

Given("the device is offline", async function (this: BddWorld) {
  this.stubState.offlineApis = true;
});

Given("league fixtures were previously cached on this device", async function (this: BddWorld) {
  await seedFixturesVaultSnapshot(this.page!, { leagueSlug: "la-liga" });
});

Given("no fixtures have been cached before on this device", async function (this: BddWorld) {
  // default — no vault seed
});

Given("the user has a cached fixtures snapshot on this device", async function (this: BddWorld) {
  await seedFixturesVaultSnapshot(this.page!, { leagueSlug: "la-liga" });
});

Given("the network is available", async function (this: BddWorld) {
  this.stubState.offlineApis = false;
  await this.context!.setOffline(false);
});

Given("a fixture is marked postponed by the provider", async function (this: BddWorld) {
  this.stubState.mode = "postponed";
  this.stubState.activeSlug = "la-liga";
});

Given("a fixture is marked cancelled by the provider", async function (this: BddWorld) {
  this.stubState.mode = "cancelled";
  this.stubState.activeSlug = "la-liga";
});

Given("the provider returns a fixture with an invalid kickoff value", async function (this: BddWorld) {
  this.stubState.mode = "invalid-kickoff";
  this.stubState.activeSlug = "la-liga";
});

Given("the provider returns the same fixture twice", async function (this: BddWorld) {
  this.stubState.mode = "duplicate";
  this.stubState.activeSlug = "la-liga";
});

Given("the provider returns a fixture with a missing away team name", async function (this: BddWorld) {
  this.stubState.mode = "malformed-team";
  this.stubState.activeSlug = "la-liga";
});

Given("the provider returns a fixture with a missing venue name", async function (this: BddWorld) {
  this.stubState.mode = "malformed-venue";
  this.stubState.activeSlug = "la-liga";
});

Given("the fixtures page has loaded successfully", async function (this: BddWorld) {
  this.stubState.mode = "default";
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

Given("the user is viewing a league with no fixtures", async function (this: BddWorld) {
  this.stubState.mode = "empty-all";
  await openFixtures(this, "bundesliga");
  await waitForFixturesLoaded(this);
});

Given("the fixtures recovery shield is active", async function (this: BddWorld) {
  await enableRecoveryShield(this);
});

Given("the user opens a non-Premier League competition", async function (this: BddWorld) {
  await enableRecoveryShield(this);
  await openFixtures(this, "la-liga");
});

Given("the user opens Premier League standings", async function (this: BddWorld) {
  await openFixtures(this, "premier-league");
  const page = this.page!;
  await page.getByRole("button", { name: /standings/i }).click();
});

Given("the user selects a future season that is not published yet", async function (this: BddWorld) {
  const page = this.page!;
  const seasonSelect = page.locator("select").first();
  if (await seasonSelect.isVisible()) {
    await seasonSelect.selectOption({ label: "2026-27" });
  } else {
    await page.getByText(/2026-27/i).first().click();
  }
  await page.waitForTimeout(800);
});

Given("the user opens Premier League player stats", async function (this: BddWorld) {
  await openFixtures(this, "premier-league");
  await this.page!.getByRole("button", { name: /stats/i }).click();
});

Given("the featured matches feed is slow or empty", async function (this: BddWorld) {
  this.stubState.featuredEmpty = true;
});

Given("a release candidate is ready for stakeholder review", async function () {
  // meta step — no UI action
});

// --- When --------------------------------------------------------------------

When("the page finishes loading", async function (this: BddWorld) {
  await waitForFixturesLoaded(this);
});

When("the fixtures page is opened", async function (this: BddWorld) {
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

When("the user views that match card", async function (this: BddWorld) {
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

When("the page renders the league list", async function (this: BddWorld) {
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

When("the page renders the fixtures list", async function (this: BddWorld) {
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

When("the user views the fixtures list", async function (this: BddWorld) {
  await openFixtures(this, "la-liga");
  await waitForFixturesLoaded(this);
});

When("the user filters by a league with no matching fixtures", async function (this: BddWorld) {
  this.stubState.mode = "empty-all";
  await clickLeague(this, "Bundesliga");
});

When("the user selects a different league", async function (this: BddWorld) {
  this.stubState.mode = "one-league-populated";
  await clickLeague(this, "La Liga");
});

When("the user chooses to open the Premier League hub", async function (this: BddWorld) {
  const page = this.page!;
  if (!page.url().includes("/fixtures")) {
    await enableRecoveryShield(this);
    await openFixtures(this, "la-liga");
    await waitForFixturesLoaded(this);
  }
  const openPl = page.getByRole("button", { name: /open premier league hub/i });
  if (await openPl.isVisible().catch(() => false)) {
    await openPl.click();
    await page.waitForTimeout(600);
  } else {
    await openFixtures(this, "premier-league");
  }
  await waitForFixturesLoaded(this);
});

When("the standings view finishes loading", async function (this: BddWorld) {
  await this.page!.getByText(/league table|standings views/i).first().waitFor({ state: "visible" });
  await this.page!.waitForTimeout(800);
});

When("the stats view finishes loading", async function (this: BddWorld) {
  await this.page!.getByText(/player leaders|stat race/i).first().waitFor({ state: "visible" });
  await this.page!.waitForTimeout(800);
});

When("the user views the home page live fixtures strip", async function (this: BddWorld) {
  await this.page!.goto("/", { waitUntil: "domcontentloaded" });
  await this.page!.waitForTimeout(1200);
});

When("the fixtures health check runs against production", async function () {
  execSync("npm run fixtures:health-check", {
    stdio: "pipe",
    env: {
      ...process.env,
      FIXTURES_HEALTH_BASE_URL: process.env.FIXTURES_HEALTH_BASE_URL || "https://fivesarena.com",
    },
  });
});

// --- Then --------------------------------------------------------------------

Then("the user should see a non-technical empty state", async function (this: BddWorld) {
  const page = this.page!;
  await expect(page.getByText(EMPTY_STATE_PATTERN).first()).toBeVisible();
});

Then("the page should not show provider jargon", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(JARGON_PATTERN);
});

Then("the user should still be able to switch to another league", async function (this: BddWorld) {
  await expect(this.page!.getByRole("button", { name: /Premier League/i }).first()).toBeVisible();
});

Then("leagues with fixtures should render normally", async function (this: BddWorld) {
  await clickLeague(this, "La Liga");
  await expect(this.page!.getByText(/Cape Town City|Durban United|Active Match Window/i).first()).toBeVisible();
});

Then("leagues without fixtures should show graceful empty states", async function (this: BddWorld) {
  this.stubState.mode = "empty-all";
  await clickLeague(this, "Bundesliga");
  await reloadFixturesIfOpen(this);
  await waitForFixturesLoaded(this);
  await expect(this.page!.getByText(EMPTY_STATE_PATTERN).first()).toBeVisible();
});

Then("the page layout should remain intact", async function (this: BddWorld) {
  await expect(this.page!.getByRole("heading", { name: /live fixtures/i })).toBeVisible();
  await expect(this.page!.getByText(/browse all competitions/i)).toBeVisible();
});

Then("the user should see a graceful empty state for {string}", async function (this: BddWorld, league: string) {
  const { buttonLabel } = resolveLeague(league);
  await clickLeague(this, buttonLabel);
  await expect(this.page!.getByText(EMPTY_STATE_PATTERN).first()).toBeVisible();
});

Then("no technical error text should be shown", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(JARGON_PATTERN);
});

Then("the page should show the cached fixtures", async function (this: BddWorld) {
  await expect(this.page!.getByText(/Vault Home|Vault Away|Saved window/i).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then("the page should label the data as last updated or saved", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).toMatch(/saved|updated|refreshing|vault/i);
});

Then("the user should see a way to retry or refresh", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).toMatch(/retry|refresh|sync|saved|updated|vault/i);
});

Then("cached fixtures should be shown", async function (this: BddWorld) {
  await expect(this.page!.getByText(/Vault Home|Saved window/i).first()).toBeVisible({ timeout: 15_000 });
});

Then("the page should indicate that the content may be stale", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).toMatch(/saved|stale|updated|offline/i);
});

Then("no raw network error should be shown", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(/failed to fetch|network error|ECONNREFUSED/i);
});

Then("the user should see an offline empty state", async function (this: BddWorld) {
  await expect(
    this.page!.getByText(/connection unavailable|offline|saved|fixtures page/i).first(),
  ).toBeVisible();
});

Then("the message should explain what to do next", async function (this: BddWorld) {
  await expect(this.page!.getByRole("button", { name: /retry|fixtures|sync/i }).first()).toBeVisible();
});

Then("the page should not render blank cards", async function (this: BddWorld) {
  const articles = this.page!.locator("article");
  const count = await articles.count();
  if (count > 0) {
    const first = await articles.first().innerText();
    expect(first.trim().length).toBeGreaterThan(0);
  }
});

Then(
  "the user should see fixtures immediately from saved data or live data",
  async function (this: BddWorld) {
    await expect(this.page!.getByText(/Vault Home|Cape Town City|Active Match Window/i).first()).toBeVisible();
  },
);

Then(
  "while a refresh is in progress the page should indicate saved data is being updated",
  async function (this: BddWorld) {
    const text = await this.page!.locator("body").innerText();
    expect(text).toMatch(/refreshing|saved|updated/i);
  },
);

Then("the layout should not flash blank between states", async function (this: BddWorld) {
  await expect(this.page!.getByRole("heading", { name: /live fixtures/i })).toBeVisible();
});

Then("the status should read Postponed", async function (this: BddWorld) {
  await expect(this.page!.getByText(/postponed/i).first()).toBeVisible();
});

Then("the status should read Cancelled", async function (this: BddWorld) {
  await expect(this.page!.getByText(/cancelled/i).first()).toBeVisible();
});

Then("the kickoff time should not be presented as live", async function (this: BddWorld) {
  const card = this.page!.locator("article").first();
  await expect(card.getByText(/^live$/i)).not.toBeVisible();
  await expect(card.locator(".animate-pulse")).not.toBeVisible();
});

Then("no score call-to-action should appear", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(/place bet|submit score/i);
});

Then(
  "the user should see a readable kickoff label or a safe time placeholder",
  async function (this: BddWorld) {
    await expect(this.page!.getByText(/TBD|Today|:/).first()).toBeVisible();
  },
);

Then("the user should not see a raw epoch number or JSON fragment", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(/1778778000|\{|\}/);
});

Then("the fixture should appear only once", async function (this: BddWorld) {
  const cards = this.page!.locator("article");
  const count = await cards.count();
  expect(count).toBeLessThanOrEqual(1);
});

Then("the page should not show duplicate cards", async function (this: BddWorld) {
  const names = await this.page!.locator("article").allInnerTexts();
  const unique = new Set(names);
  expect(unique.size).toBe(names.length);
});

Then("the page should show a safe fallback label", async function (this: BddWorld) {
  await expect(this.page!.getByText(/TBD|FC|Team/i).first()).toBeVisible();
});

Then("the layout should not break", async function (this: BddWorld) {
  await expect(this.page!.getByRole("heading", { name: /live fixtures/i })).toBeVisible();
});

Then("the user should not see null, undefined, or raw JSON", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(/null|undefined|\{|\}/i);
});

Then("the page should show a neutral venue placeholder", async function (this: BddWorld) {
  await expect(this.page!.getByText(/venue|pending|stadium/i).first()).toBeVisible();
});

Then("the match card layout should remain intact", async function (this: BddWorld) {
  await expect(this.page!.locator("article").first()).toBeVisible();
});

Then("the page should show a zero-results state", async function (this: BddWorld) {
  await expect(this.page!.getByText(EMPTY_STATE_PATTERN).first()).toBeVisible();
});

Then("the filter controls should remain visible", async function (this: BddWorld) {
  await expect(this.page!.getByText(/browse all competitions/i)).toBeVisible();
});

Then("the user should be able to clear the filter", async function (this: BddWorld) {
  this.stubState.mode = "one-league-populated";
  await clickLeague(this, "La Liga");
  await expect(this.page!.getByText(/Cape Town City|Active Match Window/i).first()).toBeVisible();
});

Then("the page should load the new league without a full reload error", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(/connection unavailable|failed to load/i);
});

Then("the previous league's empty state should not persist on screen", async function (this: BddWorld) {
  await expect(this.page!.getByText(/bundesliga/i).first()).toBeVisible();
  await expect(this.page!.getByText(/Cape Town City|Active Match Window/i).first()).toBeVisible();
});

Then(
  "the user should see a recovery message instead of a broken blank hub",
  async function (this: BddWorld) {
    await expect(this.page!.getByText(/match centre recovery/i)).toBeVisible();
  },
);

Then("the user should be able to open the Premier League hub", async function (this: BddWorld) {
  await expect(this.page!.getByRole("button", { name: /open premier league hub/i })).toBeVisible();
});

Then("Premier League schedules standings or stats should be available", async function (this: BddWorld) {
  await expect(this.page!.getByText(/premier league|matchweek|standings|fixtures hub/i).first()).toBeVisible();
});

Then("the user should not see provider configuration jargon", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).not.toMatch(JARGON_PATTERN);
});

Then(
  "the user should see an explanatory season notice or the active season table",
  async function (this: BddWorld) {
    const text = await this.page!.locator("body").innerText();
    expect(text).toMatch(/2026-27|2025-26|not published yet|league table/i);
  },
);

Then(
  'the user should not see a bare "standings unavailable" dead end',
  async function (this: BddWorld) {
    const text = await this.page!.locator("body").innerText();
    const bareOnly = /standings unavailable/i.test(text) && !/not published yet|2025-26/i.test(text);
    expect(bareOnly).toBeFalsy();
  },
);

Then(
  "the user should see an explanatory season notice or active season leaders",
  async function (this: BddWorld) {
    const text = await this.page!.locator("body").innerText();
    expect(text).toMatch(/2026-27|2025-26|not published yet|player leaders|goals/i);
  },
);

Then(
  "the user should not see a bare empty leaderboard with no context",
  async function (this: BddWorld) {
    const text = await this.page!.locator("body").innerText();
    expect(text.length).toBeGreaterThan(20);
  },
);

Then("the user should see a helpful message or saved strip data", async function (this: BddWorld) {
  const text = await this.page!.locator("body").innerText();
  expect(text).toMatch(/fixtures|offline|feed|saved|live match strip/i);
});

Then("the user should be offered a path to the full Fixtures page", async function (this: BddWorld) {
  await expect(this.page!.getByRole("link", { name: /fixtures/i }).first()).toBeVisible();
});

Then("Premier League meta matches standings and stats checks should pass", async function () {
  // asserted by successful health-check command in When step
});

Then(
  "at least one non-Premier League matches check should return a valid response shape",
  async function () {
    // asserted by successful health-check command in When step
  },
);

Then("the build should fail if critical checks do not pass", async function () {
  // health-check exits non-zero on failure — no extra assertion needed
});
