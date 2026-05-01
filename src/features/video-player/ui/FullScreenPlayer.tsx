import { useEvent, useEventListener } from "expo";
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
  const hasAttemptedFullscreen = useRef(false);

  // Overlay is shown only as a fallback when the browser blocks autoplay/fullscreen.
  // It is never shown immediately — we always try first.
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    // Native non-kiosk: play() works immediately in the setup callback.
    // Web & kiosk: play() is triggered in the readyToPlay effect (DOM not ready yet).
    if (Platform.OS !== "web") {
      p.play();
    }
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // Notify the parent when playback reaches the end.
  useEventListener(player, "playToEnd", () => {
    onEnd?.();
  });

  // Native: hide status bar.
  useEffect(() => {
    if (Platform.OS === "web") return;
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    if (status !== "readyToPlay") return;

    if (Platform.OS !== "web") {
      // Native: enter fullscreen once the player is ready.
      if (!hasAttemptedFullscreen.current) {
        hasAttemptedFullscreen.current = true;
        videoViewRef.current?.enterFullscreen();
      }
      return;
    }

    // Web: always attempt play (works if the page has user activation — which is the
    // case both for in-app navigation and for QR-code links opened by native scanners).
    player.play();

    // In kiosk mode, also attempt fullscreen immediately.
    // On Android Chrome and modern iOS Safari, QR-scan navigation carries user activation,
    // so requestFullscreen() succeeds without any additional tap.
    // On browsers that block it, we catch the rejection and show the overlay.
    if (kioskMode && !hasAttemptedFullscreen.current) {
      hasAttemptedFullscreen.current = true;
      requestWebFullscreen().catch(() => {
        // Browser denied fullscreen (no user activation in this tab).
        // Show overlay: a single tap will provide the gesture and retry.
        setShowPlayOverlay(true);
      });
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Web: show overlay on load error (applies to both kiosk and normal mode).
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (status === "error") setShowPlayOverlay(true);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Attempts to enter fullscreen using all available APIs in order:
   * 1. expo-video VideoView.enterFullscreen()  — cross-platform
   * 2. Standard requestFullscreen()            — Chrome / Firefox
   * 3. webkitRequestFullscreen()               — older Safari / macOS
   * 4. video.webkitEnterFullScreen()           — iOS Safari video element
   *
   * Returns a Promise so callers can react to failure.
   */
  function requestWebFullscreen(): Promise<void> {
    if (typeof document === "undefined") return Promise.resolve();
    if (document.fullscreenElement) return Promise.resolve();

    // expo-video's own method (may return a Promise on web)
    const vfResult = videoViewRef.current?.enterFullscreen();
    if (
      vfResult != null &&
      typeof (vfResult as unknown as PromiseLike<void>).then === "function"
    ) {
      return Promise.resolve(vfResult as unknown as void).catch(() =>
        tryDomFullscreen(),
      );
    }

    return tryDomFullscreen();
  }

  function tryDomFullscreen(): Promise<void> {
    const docEl = document.documentElement as Element & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    if (docEl.requestFullscreen) {
      return docEl.requestFullscreen();
    }
    if (docEl.webkitRequestFullscreen) {
      const r = docEl.webkitRequestFullscreen();
      return r instanceof Promise ? r : Promise.resolve();
    }

    // Last resort for iOS Safari: call webkitEnterFullScreen on the <video> element.
    const videoEl = document.querySelector("video") as
      | (HTMLVideoElement & {
          webkitEnterFullScreen?: () => void;
        })
      | null;
    if (videoEl?.webkitEnterFullScreen) {
      videoEl.webkitEnterFullScreen();
      return Promise.resolve();
    }

    return Promise.reject(new Error("fullscreen API not available"));
  }

  function handleTapToPlay(): void {
    setShowPlayOverlay(false);
    // Re-attempt play in case autoplay was also blocked silently.
    player.play();
    if (Platform.OS === "web") {
      // User gesture from the tap: fullscreen is now guaranteed to succeed.
      requestWebFullscreen().catch(() => {});
    } else if (!hasAttemptedFullscreen.current) {
      hasAttemptedFullscreen.current = true;
      videoViewRef.current?.enterFullscreen();
    }
  }

  return (
    <View style={styles.container}>
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

      {/* Fallback overlay — shown only when the browser blocks autoplay/fullscreen */}
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
