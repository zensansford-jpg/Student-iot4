# TESTING_REPORT.md — Neural Core / StudentIoT3

**Date:** 2026-11-22  
**Environment:** Windows (local workspace), Node v24.19.0, Python 3.14.4  
**Project:** `C:\Users\ASUS\life-monitor-main`

## Summary

| Area | Result | Notes |
|---|---|---|
| JS syntax checks | PASS | All `js/*.js` modules checked with `node --input-type=module --check`; `sw.js` checked with `node --check`. |
| Static HTTP smoke test | PASS | Python `http.server` on port 8765; HTTP 200 for index, css, main/config modules, version.json, manifest, sw.js. |
| Mock/demo data removal | PASS (static scan) | Searched production files for sample/demo/random/light/distance/ESP32-02 patterns; only audit doc references old demo state. |
| Supabase real-data integration | NOT RUN (live) | Requires valid browser runtime + network access to Supabase project; code implemented, not live-verified in this session. |
| Realtime subscription | NOT RUN (live) | Requires live Supabase Realtime connection. |
| Polling fallback | NOT RUN (live) | Implemented (15s interval, visibility-aware); needs runtime verification. |
| ESP32 hardware end-to-end | NOT RUN (hardware unavailable) | Requires physical ESP32-01 + DHT11, Wi-Fi, Arduino upload. |
| GitHub Pages deployment | NOT RUN | No push/deploy performed (approval required). |
| PWA install/update | NOT RUN (deployed HTTPS required) | SW/manifest present; needs deployed HTTPS test. |
| Mobile/responsive layout | NOT RUN (browser E2E) | Responsive CSS implemented; manual/browser device testing recommended. |
| CSV export | NOT RUN (browser E2E) | Implemented in UI; needs browser click test with real/loaded data. |

## Commands executed

```powershell
# Syntax checks
Get-ChildItem js\*.js | ForEach-Object { Get-Content $_.FullName -Raw | node --input-type=module --check }
Get-Content sw.js -Raw | node --check

# Static smoke test
python -m http.server 8765
Invoke-WebRequest http://127.0.0.1:8765/index.html
Invoke-WebRequest http://127.0.0.1:8765/styles.css
Invoke-WebRequest http://127.0.0.1:8765/js/main.js
Invoke-WebRequest http://127.0.0.1:8765/js/config.js
Invoke-WebRequest http://127.0.0.1:8765/version.json
Invoke-WebRequest http://127.0.0.1:8765/manifest.webmanifest
Invoke-WebRequest http://127.0.0.1:8765/sw.js

# Mock-data scan
Get-ChildItem -Recurse -File -Include *.js,*.html,*.css,*.json,*.md | Select-String -Pattern "sample =|SIMULATED LIVE|DEMO MODE|Math.random()...|lightValue|distanceValue|ESP32-02"
```

## Observed results

- All JS syntax checks: **OK**.
- All smoke-test HTTP requests: **200**.
- Mock-data scan: only `PROJECT_AUDIT.md` contained historical references to demo state.

## Known limitations / not verified

1. **Real Supabase connectivity** not verified against live project in this session.
2. **Realtime insert behavior** not verified with live ESP32 data.
3. **Hardware** (ESP32-01, DHT11, GPIO4, Wi-Fi upload) not tested.
4. **PWA update/rollback** requires deployed HTTPS and browser testing.
5. **Browser compatibility/E2E** not executed (no Playwright/Cypress run).
6. **True release rollback** on GitHub Pages requires deploying previous approved release; client-side cache rollback is implemented as best-effort.

## Recommendation before deployment

- Run browser E2E on local HTTP server.
- Verify Supabase read/realtime with actual anon key and RLS.
- Test ESP32 firmware upload and confirm two rows (temp/humidity) appear per cycle.
- Verify GitHub Pages build/paths on staging before production push.