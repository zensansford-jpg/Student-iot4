# CHANGELOG

## [1.0.0] - 2026-11-22

### Added
- Neural Core visual identity and responsive dashboard layout.
- Real Supabase integration for `public.sensor_readings` (ESP32-01, temperature/humidity).
- Realtime INSERT subscription with polling fallback and reconnect handling.
- Device status model: ONLINE/OFFLINE/WAITING/ERROR with configurable threshold.
- Neural system visualization driven by actual runtime/system states.
- Explainable AI analytics based on real sensor readings.
- Software Center with version display, manifest check, release notes, user-approved update, and rollback state.
- PWA service worker scaffold with versioned cache and update prompt.
- CSV export, data filters, and recent readings table.
- Firmware baseline, `.env.example`, audit/integration/architecture/handoff docs.

### Removed
- Simulated/random production sensor readings and demo-only light/distance sensors.

### Security / Reliability
- Publishable/anon key only in client; no service_role key.
- No autonomous source-code modification or arbitrary remote code execution.
- Supabase schema/policies unchanged.