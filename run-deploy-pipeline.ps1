$ErrorActionPreference = 'Continue'
$repo = 'C:\Users\rkhol\Bookit-5s-Arena'
$log = Join-Path $repo 'deploy-result.log'
Set-Location $repo

function Log($m) { Add-Content -Path $log -Value $m }

Remove-Item $log -ErrorAction SilentlyContinue
Log '=== STEP 1: git status -sb ==='
git status -sb 2>&1 | ForEach-Object { Log $_ }
Log ''
Log '=== STEP 2: git add specific files ==='
git add lib/sports/leagueSlug.js app/fixtures/page.jsx app/layout.jsx app/page.jsx context/ThemeContext.jsx components/Header.jsx components/home/HomeLiveFixtures.jsx components/home/HomeMediaHighlights.jsx components/fixtures/ArenaFixturesExperience.jsx lib/sports/football.js public/sw.js assets/styles/globals.css .env.example 'STRUCTURE/04-Updates/comms-log.md' 'STRUCTURE/06-Reference/Page Inventory.md' 2>&1 | ForEach-Object { Log $_ }
Log ''
Log '=== STEP 3: git add -u ==='
git add -u 2>&1 | ForEach-Object { Log $_ }
Log ''
Log '=== STEP 4: git commit ==='
git commit -m "fix: Five's Arena regression recovery (theme, PL fixtures, highlights)" 2>&1 | ForEach-Object { Log $_ }
$commitExit = $LASTEXITCODE
Log "commit exit: $commitExit"
Log ''
Log '=== STEP 5: git pull --rebase origin main ==='
git pull --rebase origin main 2>&1 | ForEach-Object { Log $_ }
$pullExit = $LASTEXITCODE
Log "pull exit: $pullExit"
Log ''
Log '=== STEP 6: git push origin main ==='
git push origin main 2>&1 | ForEach-Object { Log $_ }
$pushExit = $LASTEXITCODE
Log "push exit: $pushExit"
Log ''
Log '=== STEP 7: npx vercel --prod --yes ==='
npx vercel --prod --yes 2>&1 | ForEach-Object { Log $_ }
$vercelExit = $LASTEXITCODE
Log "vercel exit: $vercelExit"
Log ''
Log '=== FINAL: git log -1 ==='
git log -1 2>&1 | ForEach-Object { Log $_ }
Log ''
Log "=== SUMMARY: push_exit=$pushExit vercel_exit=$vercelExit ==="
