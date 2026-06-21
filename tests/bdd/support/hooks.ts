import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, devices } from "@playwright/test";
import { BddWorld } from "./world.js";
import { registerFootballApiStubs } from "./fixturesApiStubs.js";

setDefaultTimeout(90_000);

const ONBOARDING_KEY = "5s_favorite_leagues_v1";

async function primeBddBrowserState(page: BddWorld["page"]) {
  if (!page) return;
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(["premier-league", "la-liga", "psl"]),
    );
    window.localStorage.setItem("bdd_fixtures_shield", "false");
  }, ONBOARDING_KEY);
}

Before(async function (this: BddWorld) {
  this.browser = await chromium.launch({ headless: process.env.BDD_HEADED !== "true" });
  this.context = await this.browser.newContext({
    ...devices["iPhone 13"],
    baseURL: this.baseURL,
  });
  this.page = await this.context.newPage();
  await primeBddBrowserState(this.page);
  await registerFootballApiStubs(this.page, this.stubState);
});

After(async function (this: BddWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
  this.stubState = new (await import("./fixturesApiStubs.js")).FixturesStubState();
});
