import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { Play } from "lucide-react-native";

interface Props {
  uri: string;
  onEnd?: () => void;
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

export function FullScreenPlayer({ uri, onEnd }: Props) {
  const videoViewRef = useRef<VideoView>(null);
  const hasEnteredFullscreen = useRef(false);

  // Fallback overlay: shown only if even unmuted autoplay is blocked (very rare).
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    // On web, _mountedVideos is empty at this point (VideoView not yet mounted),
    // so p.play() would iterate over an empty Set and do nothing.
    // We trigger play() in the readyToPlay useEffect instead.
    // On native, play() works immediately.
    if (Platform.OS !== "web") {
      p.play();
    }
    // No muting: the user clicked on the question (user gesture), so the browser
    // allows unmuted autoplay unconditionally on that tab.
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
      // Native: enter fullscreen once the player is initialised.
      if (!hasEnteredFullscreen.current) {
        hasEnteredFullscreen.current = true;
        videoViewRef.current?.enterFullscreen();
      }
    } else {
      // Web: play() in the setup callback did nothing (no DOM element yet).
      // The user's click on the question gives the tab user activation,
      // so unmuted autoplay is allowed.
      player.play();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Web: show fallback overlay only if the source itself fails to load.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (status === "error") {
      setShowPlayOverlay(true);
    }
  }, [status]);

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
    requestWebFullscreen();
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

      {/* Fallback play overlay — only if browser blocks autoplay entirely */}
      {showPlayOverlay && (
        <Pressable style={styles.centeredOverlay} onPress={handleTapToPlay}>
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
