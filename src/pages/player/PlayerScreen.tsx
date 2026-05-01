import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOfflineCache } from "@features/offline-cache";
import { FullScreenPlayer } from "@features/video-player";
import { useCatalog } from "@shared/api/useCatalog";
import {
  IconSize,
  Radius,
  Size,
  Spacing,
  useTheme,
} from "@shared/design-system";
import { FontFamily, FontSize } from "@shared/design-system/tokens";
import { LoadingSpinner } from "@shared/ui/LoadingSpinner";
import { Txt } from "@shared/ui/Txt";

// The player always uses pure black/white regardless of theme — cinema convention.
const PLAYER_BACKGROUND = "#000000";
const OVERLAY_TEXT_COLOR = "#FFFFFF";
const REDIRECT_DELAY_MS = 3_000;
const COUNTDOWN_INTERVAL_MS = 1_000;
const COUNTDOWN_START = REDIRECT_DELAY_MS / COUNTDOWN_INTERVAL_MS;

interface Props {
  questionId: string;
  kioskMode?: boolean;
}

export function PlayerScreen({ questionId, kioskMode = false }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { resolvePlaybackUri } = useOfflineCache();
  const { findQuestionById } = useCatalog();
  const question = findQuestionById(questionId);

  // null = countdown not started; number = seconds remaining before redirect.
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );

  // On web: resolvePlaybackUri is async and returns a Blob URL from Cache
  // Storage so the video plays offline without Service Worker interception.
  // On native: synchronous resolution (local file URI or remote URL).
  const [playbackUri, setPlaybackUri] = useState<string | null>(null);

  useEffect(() => {
    if (!question) return;
    let cancelled = false;
    let createdBlobUri: string | null = null;

    resolvePlaybackUri(question.videoId, question.videoRemoteUrl).then(
      (uri) => {
        if (cancelled) {
          if (uri.startsWith("blob:")) URL.revokeObjectURL(uri);
          return;
        }
        createdBlobUri = uri.startsWith("blob:") ? uri : null;
        setPlaybackUri(uri);
      },
    );

    return () => {
      cancelled = true;
      if (createdBlobUri) URL.revokeObjectURL(createdBlobUri);
      setPlaybackUri(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.videoId, question?.videoRemoteUrl]);

  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown === 0) {
      router.back();
      return;
    }
    const timer = setTimeout(
      () => setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null)),
      COUNTDOWN_INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [redirectCountdown, router]);

  if (!question) return <LoadingSpinner message={t("player.loading")} />;
  if (!playbackUri) return <LoadingSpinner message={t("player.loading")} />;

  function handleClose(): void {
    router.back();
  }

  function handlePlaybackEnd(): void {
    setRedirectCountdown(COUNTDOWN_START);
  }

  return (
    <View style={styles.container}>
      <FullScreenPlayer
        uri={playbackUri}
        onEnd={handlePlaybackEnd}
        kioskMode={kioskMode}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View
          style={[styles.topBar, { backgroundColor: theme.bgOverlay }]}
          pointerEvents="box-none"
        >
          <Txt
            style={[styles.questionText, { color: OVERLAY_TEXT_COLOR }]}
            numberOfLines={2}
          >
            {question.label}
          </Txt>
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { backgroundColor: theme.bgOverlay }]}
            accessibilityRole="button"
            accessibilityLabel={t("player.a11yClose")}
          >
            <X size={IconSize.md} color={OVERLAY_TEXT_COLOR} />
          </Pressable>
        </View>

        {redirectCountdown !== null && (
          <View style={styles.redirectBadge} pointerEvents="none">
            <Txt style={styles.redirectText}>
              {t("player.redirectCountdown", { count: redirectCountdown })}
            </Txt>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PLAYER_BACKGROUND },
  overlay: { ...StyleSheet.absoluteFillObject },
  topBar: {
    position: "absolute",
    top: Spacing[12],
    left: Spacing[5],
    right: Spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingLeft: Spacing[4],
    paddingRight: Spacing[2],
  },
  closeButton: {
    width: Size.closeButtonSize,
    height: Size.closeButtonSize,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  questionText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
    color: OVERLAY_TEXT_COLOR,
  },
  redirectBadge: {
    position: "absolute",
    bottom: Spacing[8],
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.full,
  },
  redirectText: {
    color: OVERLAY_TEXT_COLOR,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});
