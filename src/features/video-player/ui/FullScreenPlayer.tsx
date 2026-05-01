import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { Play } from "lucide-react-native";

interface Props {
  uri: string;
  onEnd?: () => void;
  /** When true (QR code scan), show a tap-to-play overlay immediately.
   * Browsers block unmuted autoplay + fullscreen without a user gesture
   * in a freshly-opened tab. The tap provides that gesture. */
  kioskMode?: boolean;
}

type OrientationExtended = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
};

const PLAY_ICON_SIZE = 64;
const PLAYER_BACKGROUND = "#000000";

function lockLandscape(): void {
  if (Platform.OS !== "web") return;
  const orientation = (
    typeof screen !== "undefined" ? screen.orientation : null
  ) as OrientationExtended | null;
  orientation?.lock?.("landscape-primary")?.catch(() => {});
}

function unlockOrientation(): void {
  if (Platform.OS !== "web") return;
  const orientation = (
    typeof screen !== "undefined" ? screen.orientation : null
  ) as OrientationExtended | null;
  orientation?.unlock?.();
}

export function FullScreenPlayer({ uri, onEnd, kioskMode = false }: Props) {
  const videoViewRef = useRef<VideoView>(null);
  // containerRef gives us a DOM anchor to find the <video> element via querySelector.
  const containerRef = useRef<View>(null);
  // Guard: run autoplay logic only once, even if statusChange fires several times.
  const autoplayDone = useRef(false);

  // Shown immediately in kiosk mode (QR code scan = fresh tab, no prior gesture)
  // or as fallback when the browser silently blocks autoplay in normal mode.
  const [showPlayOverlay, setShowPlayOverlay] = useState(
    kioskMode && Platform.OS === 'web',
  );

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    // Native: play() works immediately in the setup callback because the native
    // player is already connected. On web the <video> element does not exist yet.
    if (Platform.OS !== "web") {
      p.play();
    }
  });

  useEventListener(player, "playToEnd", () => {
    onEnd?.();
  });

  // Native: hide status bar while the player is on screen.
  useEffect(() => {
    if (Platform.OS === "web") return;
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  // Handle status changes directly (useEventListener bypasses the React state
  // update cycle, so play/fullscreen are triggered as soon as the event fires).
  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "error") {
      if (Platform.OS === "web") setShowPlayOverlay(true);
      return;
    }

    if (status !== "readyToPlay") return;
    if (autoplayDone.current) return;
    autoplayDone.current = true;

    if (Platform.OS !== "web") {
      // Native: player is already playing (started in setup callback).
      // Just enter fullscreen.
      videoViewRef.current?.enterFullscreen();
      return;
    }

    // ── Web ──────────────────────────────────────────────────────────────────
    // We call play() on the underlying <video> DOM element directly so that the
    // returned Promise tells us whether the browser allowed autoplay.
    // expo-video's player.play() swallows NotAllowedError silently, which is why
    // we bypass it here.
    const container = containerRef.current as unknown as HTMLElement | null;
    const videoEl = (container?.querySelector?.("video") ??
      document.querySelector("video")) as HTMLVideoElement | null;

    if (!videoEl) {
      // VideoView not yet in the DOM — fall back to expo-video.
      player.play();
      if (kioskMode) attemptWebFullscreen().catch(() => {});
      return;
    }

    const playPromise = videoEl.play();

    if (!playPromise) {
      // Very old browser: assume play succeeded.
      if (kioskMode) attemptWebFullscreen().catch(() => {});
      return;
    }

    playPromise
      .then(() => {
        // Play was allowed by the browser.
        if (kioskMode) {
          attemptWebFullscreen().catch(() => {
            // Fullscreen blocked but video is playing — acceptable on desktop.
          });
        }
      })
      .catch(() => {
        // NotAllowedError: browser blocked autoplay (no user activation in this tab).
        // Show the tap overlay so the user can provide the gesture.
        setShowPlayOverlay(true);
      });
  });

  // ── Fullscreen helpers ──────────────────────────────────────────────────────

  /**
   * Tries fullscreen in order:
   * 1. document.requestFullscreen()        — Chrome / Firefox / Edge
   * 2. document.webkitRequestFullscreen()  — older Safari / macOS
   * 3. video.webkitEnterFullScreen()       — iOS Safari (requires user gesture)
   */
  function attemptWebFullscreen(): Promise<void> {
    if (typeof document === "undefined") return Promise.resolve();
    if (document.fullscreenElement) return Promise.resolve();

    const docEl = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    if (docEl.requestFullscreen) {
      return docEl.requestFullscreen();
    }

    if (docEl.webkitRequestFullscreen) {
      const r = docEl.webkitRequestFullscreen();
      return r instanceof Promise ? r : Promise.resolve();
    }

    // iOS Safari: only works from a real user gesture.
    const videoEl = document.querySelector("video") as
      | (HTMLVideoElement & { webkitEnterFullScreen?: () => void })
      | null;
    if (videoEl?.webkitEnterFullScreen) {
      videoEl.webkitEnterFullScreen();
      return Promise.resolve();
    }

    return Promise.reject(new Error("fullscreen not available"));
  }

  function handleTapToPlay(): void {
    setShowPlayOverlay(false);

    if (Platform.OS !== "web") {
      player.play();
      videoViewRef.current?.enterFullscreen();
      return;
    }

    // User tap = guaranteed user activation → play + fullscreen both succeed.
    const container = containerRef.current as unknown as HTMLElement | null;
    const videoEl = (container?.querySelector?.("video") ??
      document.querySelector("video")) as HTMLVideoElement | null;

    if (videoEl) {
      videoEl.play().catch(() => {});
    } else {
      player.play();
    }
    attemptWebFullscreen().catch(() => {});
  }

  return (
    <View style={styles.container} ref={containerRef}>
      <VideoView
        ref={videoViewRef}
        style={styles.video}
        player={player}
        fullscreenOptions={{ enable: true, orientation: "landscape" }}
        allowsPictureInPicture={false}
        contentFit="contain"
        nativeControls
        onFullscreenEnter={lockLandscape}
        onFullscreenExit={unlockOrientation}
      />

      {/* Tap-to-play overlay — only appears when the browser blocks autoplay */}
      {showPlayOverlay && (
        <Pressable style={styles.tapOverlay} onPress={handleTapToPlay}>
          <View style={styles.playButton}>
            <Play size={PLAY_ICON_SIZE} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PLAYER_BACKGROUND,
    justifyContent: "center",
  },
  video: {
    flex: 1,
  },
  // Full-page overlay used as fallback when browser blocks autoplay/fullscreen.
  // Dark semi-transparent background + centred play icon.
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
