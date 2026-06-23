$ErrorActionPreference = "Stop"
Set-Location "C:\Users\rkhol\Bookit-5s-Arena"
$log = Join-Path (Get-Location) "deploy-result.log"
Remove-Item $log -ErrorAction SilentlyContinue
function Log($m) { Add-Content -Path $log -Value $m; Write-Host $m }

Log "=== $(Get-Date -Format o) ship-regression ==="
Log (git status -sb 2>&1 | Out-String)
Log (git log -1 --oneline 2>&1 | Out-String)

git add `
  lib/sports/leagueSlug.js `
  app/fixtures/page.jsx app/layout.jsx app/page.jsx `
  context/ThemeContext.jsx components/Header.jsx `
  components/home/HomeLiveFixtures.jsx components/home/HomeMediaHighlights.jsx components/home/FixturesPromo.jsx `
  components/fixtures/ArenaFixturesExperience.jsx `
  lib/sports/football.js public/sw.js assets/styles/globals.css .env.example `
  data/courts.json `
  public/images `
  "STRUCTURE/04-Updates/comms-log.md" `
  "STRUCTURE/06-Reference/Page Inventory.md" `
  scripts/ship-regression.ps1

git add -u

$status = git status --porcelain
if ($status) {
  git commit -m "fix: Five's Arena regression recovery (theme, PL fixtures, highlights, assets)"
  Log "committed"
} else {
  Log "nothing to commit"
}

git pull --rebase origin main 2>&1 | ForEach-Object { Log $_ }
git push origin main 2>&1 | ForEach-Object { Log $_ }

if (Get-Command vercel -ErrorAction SilentlyContinue) {
  vercel --prod --yes 2>&1 | ForEach-Object { Log $_ }
} else {
  npx vercel --prod --yes 2>&1 | ForEach-Object { Log $_ }
}

Log "=== DONE ==="
