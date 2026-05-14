import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { FixturesStubState } from "./fixturesApiStubs.js";

export class BddWorld extends World {
  browser?: Browser;

  context?: BrowserContext;

  page?: Page;

  stubState = new FixturesStubState();

  baseURL = process.env.BDD_BASE_URL || "http://localhost:3002";

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(BddWorld);
