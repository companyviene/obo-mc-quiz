import * as LegacyFileSystem from 'expo-file-system/legacy';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { VideoStatus } from '@entities/video';
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
      if (Platform.OS === 'web') return;

      const cached = getVideoCache(videoId);
      if (cached.status === VideoStatus.Cached || cached.status === VideoStatus.Downloading) return;

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
    },
    [setDownloading, setCached, setError, getVideoCache],
  );

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
