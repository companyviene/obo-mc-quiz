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
  const hasEnteredFullscreen = useRef(false);

  // In kiosk mode, show the overlay immediately so the user tap provides
  // the browser user-activation required for autoplay + fullscreen.
  const [showPlayOverlay, setShowPlayOverlay] = useState(kioskMode);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    // Kiosk mode: do NOT attempt to play — wait for the tap gesture.
    // Normal mode on native: play() works immediately.
    if (Platform.OS !== "web" && !kioskMode) {
      p.play();
    }
    // On web (non-kiosk): play() is triggered in readyToPlay effect.
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
      // Native kiosk: also wait for the tap overlay.
      if (kioskMode) return;
      // Native normal: enter fullscreen once the player is initialised.
      if (!hasEnteredFullscreen.current) {
        hasEnteredFullscreen.current = true;
        videoViewRef.current?.enterFullscreen();
      }
    } else {
      // Web non-kiosk: play() in the setup callback did nothing (no DOM element yet).
      // The user's click on the question gives the tab user activation,
      // so unmuted autoplay is allowed.
      if (!kioskMode) {
        player.play();
      }
      // Kiosk mode: tap overlay is already visible; handleTapToPlay() will play + fullscreen.
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Web: show fallback overlay if the source fails to load (non-kiosk only — in kiosk
  // the overlay is already visible from the start).
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!kioskMode && status === "error") {
      setShowPlayOverlay(true);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  function requestWebFullscreen(): void {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) return;
    const vfPromise = videoViewRef.current?.enterFullscreen();
    if (vfPromise) {
      vfPromise.catch(() => {
        const el = document.documentElement as Element & {
          webkitRequestFullscreen?: () => Promise<void>;
        };
        (
          el.requestFullscreen ?? el.webkitRequestFullscreen?.bind(el)
        )?.().catch(() => {});
      });
      return;
    }
    const el = document.documentElement as Element & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    (el.requestFullscreen ?? el.webkitRequestFullscreen?.bind(el))?.().catch(
      () => {},
    );
  }

  function handleTapToPlay(): void {
    setShowPlayOverlay(false);
    player.play();
    if (Platform.OS === "web") {
      requestWebFullscreen();
    } else if (kioskMode && !hasEnteredFullscreen.current) {
      hasEnteredFullscreen.current = true;
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
        // nativeControls: shows the HTML5 control bar (play/pause, volume, fullscreen)
        // on hover — on all platforms.
        nativeControls
        onFullscreenEnter={lockLandscape}
        onFullscreenExit={unlockOrientation}
      />

      {/* Tap-to-play overlay: full-screen in kiosk mode, centred icon as fallback */}
      {showPlayOverlay && (
        <Pressable
          style={kioskMode ? styles.kioskOverlay : styles.centeredOverlay}
          onPress={handleTapToPlay}
        >
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
  // Full-page kiosk overlay: covers everything, tap anywhere to start
  kioskOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  centeredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
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
