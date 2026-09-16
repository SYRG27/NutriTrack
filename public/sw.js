/* NutriTrack service worker.
 *
 * Deliberately conservative. Pages are always fetched from the network first,
 * because a cached HTML shell that names a bundle a later deploy deleted is a
 * blank screen with no error — which this project has already been bitten by.
 * Only content-addressed files, whose names change when their contents do,
 * are served from the cache first.
 */
const VERSION = "v3";
const SHELL = `nutritrack-shell-${VERSION}`;
const ASSETS = `nutritrack-assets-${VERSION}`;

const OFFLINE_PAGE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll([OFFLINE_PAGE, "/icon-192.png"])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

/** Hashed bundles and exercise photos never change under the same name. */
const immutable = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/train/assets/") ||
  url.pathname.startsWith("/train/media/") ||
  /\.(png|jpg|jpeg|svg|webp|woff2?)$/.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache anything that talks to Supabase or our own API.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  if (immutable(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Pages: network first, cache as a fallback, offline page as the last resort.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && request.mode === "navigate") {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() =>
        caches
          .match(request)
          .then((hit) => hit || (request.mode === "navigate" ? caches.match(OFFLINE_PAGE) : undefined)),
      ),
  );
});
