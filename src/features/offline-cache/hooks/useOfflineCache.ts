import * as LegacyFileSystem from 'expo-file-system/legacy';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { VideoStatus } from '@entities/video';
import { buildVirtualUrl, downloadVideoToCache, isVideoCached } from '../lib/webVideoCache';
import { useCacheStore } from '../store/cacheStore';

function buildLocalUri(videoId: string): string {
  const cacheDir = LegacyFileSystem.cacheDirectory ?? 'file:///tmp/';
  return `${cacheDir}obo_${videoId}.mp4`;
}

export function useOfflineCache() {
  const setDownloading = useCacheStore((s) => s.setDownloading);
  const setCached = useCacheStore((s) => s.setCached);
  const setError = useCacheStore((s) => s.setError);
  const getVideoCache = useCacheStore((s) => s.getVideoCache);

  const downloadVideo = useCallback(
    async (videoId: string, remoteUrl: string): Promise<void> => {
      const cached = getVideoCache(videoId);
      if (cached.status === VideoStatus.Cached || cached.status === VideoStatus.Downloading) return;

      if (Platform.OS === 'web') {
        await downloadVideoWeb(videoId, remoteUrl);
        return;
      }

      await downloadVideoNative(videoId, remoteUrl);
    },
    [setDownloading, setCached, setError, getVideoCache], // eslint-disable-line react-hooks/exhaustive-deps
  );

  async function downloadVideoWeb(videoId: string, remoteUrl: string): Promise<void> {
    const alreadyCached = await isVideoCached(videoId);
    if (alreadyCached) {
      setCached(videoId, buildVirtualUrl(videoId));
      return;
    }
    setDownloading(videoId, 0);
    try {
      await downloadVideoToCache(videoId, remoteUrl, (progress) =>
        setDownloading(videoId, progress),
      );
      setCached(videoId, buildVirtualUrl(videoId));
    } catch {
      setError(videoId);
    }
  }

  async function downloadVideoNative(videoId: string, remoteUrl: string): Promise<void> {
    const localUri = buildLocalUri(videoId);
    setDownloading(videoId, 0);

    const task = LegacyFileSystem.createDownloadResumable(
      remoteUrl,
      localUri,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        const progress =
          totalBytesExpectedToWrite > 0 ? totalBytesWritten / totalBytesExpectedToWrite : 0;
        setDownloading(videoId, progress);
      },
    );

    try {
      const result = await task.downloadAsync();
      if (result?.uri) {
        setCached(videoId, result.uri);
      } else {
        setError(videoId);
      }
    } catch {
      setError(videoId);
    }
  }

  const resolvePlaybackUri = useCallback(
    (videoId: string, remoteUrl: string): string => {
      const cached = getVideoCache(videoId);
      if (cached.status === VideoStatus.Cached && cached.localUri) {
        return cached.localUri;
      }
      return remoteUrl;
    },
    [getVideoCache],
  );

  return { downloadVideo, resolvePlaybackUri, getVideoCache };
}
