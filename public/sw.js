// OBO MC Quiz — Service Worker
// Serves cached videos at /video-cache/{videoId} with range request support.
// CACHE_NAME must stay in sync with src/features/offline-cache/lib/webVideoCache.ts

const CACHE_NAME = 'obo-videos-v1';
const VIDEO_CACHE_PREFIX = '/video-cache/';
const RANGE_HEADER_PATTERN = /^bytes=(\d+)-(\d*)$/i;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(VIDEO_CACHE_PREFIX)) return;
  event.respondWith(serveVideo(event.request, url.pathname));
});

async function serveVideo(request, pathname) {
  const cache = await caches.open(CACHE_NAME);
  const stored = await cache.match(pathname);
  if (!stored) return new Response('Not cached', { status: 404 });

  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return stored.clone();

  return buildRangeResponse(stored, rangeHeader);
}

async function buildRangeResponse(stored, rangeHeader) {
  const buffer = await stored.clone().arrayBuffer();
  const match = RANGE_HEADER_PATTERN.exec(rangeHeader);
  if (!match) return stored.clone();

  const total = buffer.byteLength;
  const start = parseInt(match[1], 10);
  const end = match[2] ? Math.min(parseInt(match[2], 10), total - 1) : total - 1;

  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(end - start + 1),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    },
  });
}
