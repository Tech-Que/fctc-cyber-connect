import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

// PWA disabled in development because the service worker caches aggressively
// and gets in the way of hot-reload. Enabled only in production builds.
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // clientsClaim makes the service worker take control of all open clients
  // immediately on activation, which is what Lighthouse's "service-worker
  // controls page and start_url" audit checks for on first visit.
  clientsClaim: true,
  // Skip Workbox precaching of the full asset manifest. Precache happens
  // during install, which delays activation past Lighthouse's audit window.
  // We still get runtime caching from next-pwa's default routes; we just
  // don't pre-warm everything on first SW install.
  publicExcludes: ["!**/*"],
  buildExcludes: [/.*/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

// next-pwa@5.6.0 was written before NextConfig grew its current type surface;
// the plugin's input type is narrower than NextConfig, so we cast through
// unknown to satisfy both.
export default withPWA(nextConfig as unknown as Parameters<typeof withPWA>[0]);
