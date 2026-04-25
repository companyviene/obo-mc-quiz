import { create } from 'zustand';
import { VideoStatus } from '@entities/video';
import { StorageKey } from '@shared/config/enums';
import { readJson, writeJson } from '@shared/lib/storage';

interface VideoCache {
  status: VideoStatus;
  localUri: string | null;
  progress: number;
  cachedAt: string | null;
}

interface CacheState {
  cacheMap: Record<string, VideoCache>;
  hydrate: () => Promise<void>;
  setDownloading: (videoId: string, progress: number) => void;
  setCached: (videoId: string, localUri: string) => void;
  setError: (videoId: string) => void;
  getVideoCache: (videoId: string) => VideoCache;
}

const DEFAULT_CACHE: VideoCache = {
  status: VideoStatus.Remote,
  localUri: null,
  progress: 0,
  cachedAt: null,
};

export const useCacheStore = create<CacheState>((set, get) => ({
  cacheMap: {},

  hydrate: async () => {
    const stored = await readJson<Record<string, VideoCache>>(StorageKey.VideoCache);
    if (stored) {
      set({ cacheMap: stored });
    }
  },

  setDownloading: (videoId, progress) => {
    set((state) => {
      const updated = {
        ...state.cacheMap,
        [videoId]: { ...DEFAULT_CACHE, status: VideoStatus.Downloading, progress },
      };
      return { cacheMap: updated };
    });
  },

  setCached: (videoId, localUri) => {
    set((state) => {
      const updated = {
        ...state.cacheMap,
        [videoId]: {
          status: VideoStatus.Cached,
          localUri,
          progress: 1,
          cachedAt: new Date().toISOString(),
        },
      };
      void writeJson(StorageKey.VideoCache, updated);
      return { cacheMap: updated };
    });
  },

  setError: (videoId) => {
    set((state) => {
      const updated = {
        ...state.cacheMap,
        [videoId]: { ...DEFAULT_CACHE, status: VideoStatus.Error },
      };
      return { cacheMap: updated };
    });
  },

  getVideoCache: (videoId) => {
    return get().cacheMap[videoId] ?? DEFAULT_CACHE;
  },
}));
