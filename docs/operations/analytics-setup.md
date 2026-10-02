# Public web analytics

CLPR supports PostHog and Google Analytics. Both providers are initialized after analytics consent, and the consent provider respects Do Not Track and Global Privacy Control. Session recording and PostHog autocapture are disabled.

The production frontend loads `/analytics-config.js` before the app module. Deployments can mount a file at `/usr/share/nginx/html/analytics-config.js` containing public project configuration:

```js
window.__CLPR_ANALYTICS_CONFIG__ = {
  enabled: true,
  autoConsent: false,
  googleMeasurementId: 'G-YOURSTREAM',
  postHogApiKey: 'YOUR_POSTHOG_PROJECT_TOKEN',
  postHogHost: 'https://us.i.posthog.com',
  domain: 'clpr.tv',
};
```

Use the ingestion host for the project's region. The example uses PostHog Cloud US. A PostHog personal API key is a private management credential and must never appear in this file or any `VITE_*` setting. Keep private credentials outside source control and browser assets.

The checked-in runtime file leaves build-time defaults in place. `/analytics-config.js` is served without caching so a deployment can update project settings without rebuilding the frontend. Keep it disabled in disposable QA environments unless they use a separate test project.

Page views follow route changes and the initial consent grant. URL query strings are excluded from explicit event URLs. Existing login, clip submission, playback, and settings events use the shared tracker. Successful creator title/visibility changes, submission approval/rejection, and clip sharing also send events to both configured providers. Creator titles and rejection reasons are not included in those action events.

Before claiming production collection works, verify all of these:

1. A fresh browser sends no analytics before consent.
2. Granting analytics consent initializes the configured providers and sends the current page view.
3. Navigation and a representative action reach the intended project.
4. Revoking consent stops subsequent collection, including when SDK loading is still pending.
5. PostHog events appear in the selected project and Google events appear in the web stream's realtime or debug view.

Local tests and successful ingestion requests do not establish that a provider dashboard has received production data. Record those checks separately from deployment and browser evidence.
