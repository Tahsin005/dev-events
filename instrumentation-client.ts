import posthog from "posthog-js"

const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";
const uiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: apiHost,
  ui_host: uiHost,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
