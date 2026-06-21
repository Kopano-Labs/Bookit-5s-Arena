import { defineConfig } from "@playwright/test";

/** Used by start-server-and-test before Cucumber BDD runs. */
export default defineConfig({
  webServer: {
    command: "npm run dev:bdd",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
