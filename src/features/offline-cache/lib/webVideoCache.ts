// CACHE_NAME must stay in sync with public/sw.js
const CACHE_NAME = 'obo-videos-v1';
const VIDEO_MIME_TYPE = 'video/mp4';
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_CONTENT_LENGTH = 'Content-Length';
const HEADER_ACCEPT_RANGES = 'Accept-Ranges';

export async function isVideoCached(remoteUrl: string): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  const cache = await caches.open(CACHE_NAME);
  const match = await cache.match(remoteUrl);
  return match !== null;
}

export async function downloadVideoToCache(
  remoteUrl: string,
  onProgress: (progress: number) => void,
): Promise<void> {
  const response = await fetch(remoteUrl, { mode: 'cors' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error('No response body');

  const contentLength = Number(response.headers.get(HEADER_CONTENT_LENGTH) ?? 0);
  const reader = response.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (contentLength > 0) onProgress(received / contentLength);
  }

  const blob = new Blob(chunks, { type: VIDEO_MIME_TYPE });
  const cache = await caches.open(CACHE_NAME);
  await cache.put(
    remoteUrl,
    new Response(blob, {
      headers: {
        [HEADER_CONTENT_TYPE]: VIDEO_MIME_TYPE,
        [HEADER_CONTENT_LENGTH]: String(blob.size),
        [HEADER_ACCEPT_RANGES]: 'bytes',
      },
    }),
  );
}
