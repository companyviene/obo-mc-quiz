export enum VideoStatus {
  Remote = 'REMOTE',
  Downloading = 'DOWNLOADING',
  Cached = 'CACHED',
  Error = 'ERROR',
}

export interface Video {
  id: string;
  remoteUrl: string;
  localUri: string | null;
  durationSeconds: number;
  status: VideoStatus;
  cachedAt: Date | null;
  downloadProgress: number;
}
