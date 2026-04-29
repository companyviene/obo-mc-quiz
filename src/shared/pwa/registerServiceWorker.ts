import { Platform } from 'react-native';

const SW_PATH = '/sw.js';

export function registerServiceWorker(): void {
  if (Platform.OS !== 'web') return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register(SW_PATH).catch(() => {});
}
