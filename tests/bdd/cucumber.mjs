export default {
  paths: ["tests/bdd/fixtures.feature"],
  import: [
    "tests/bdd/support/world.ts",
    "tests/bdd/support/hooks.ts",
    "tests/bdd/steps/fixtures.steps.ts",
  ],
  format: ["progress-bar"],
  tags:
    process.env.BDD_TAGS || "@critical and not @target and not @release-gate",
  parallel: 1,
  publishQuiet: true,
};
