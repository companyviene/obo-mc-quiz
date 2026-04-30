// OBO MC Quiz — Service Worker
// Intercepts video requests (.mp4), serves from Cache Storage when available.
// Cross-origin videos (Cloudinary) are cached by their full remote URL.
// CACHE_NAME must stay in sync with src/features/offline-cache/lib/webVideoCache.ts

const CACHE_NAME = "obo-videos-v1";
const RANGE_HEADER_PATTERN = /^bytes=(\d+)-(\d*)$/i;

// Activate immediately so the SW controls the current page without needing a
// reload. This ensures the fetch handler is in place before any video request.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function isVideoRequest(url) {
  return url.pathname.endsWith(".mp4");
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!isVideoRequest(url)) return;
  event.respondWith(handleVideoRequest(event.request));
});

async function handleVideoRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const stored = await cache.match(request.url);

  if (!stored) {
    // Not cached — let the browser stream directly from network.
    return fetch(request);
  }

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) return stored.clone();

  return buildRangeResponse(stored, rangeHeader);
}

async function buildRangeResponse(stored, rangeHeader) {
  const buffer = await stored.clone().arrayBuffer();
  const match = RANGE_HEADER_PATTERN.exec(rangeHeader);
  if (!match) return stored.clone();

  const total = buffer.byteLength;
  const start = parseInt(match[1], 10);
  const end = match[2]
    ? Math.min(parseInt(match[2], 10), total - 1)
    : total - 1;

  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Content-Length": String(end - start + 1),
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    },
  });
}
