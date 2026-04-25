import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOfflineCache } from '@features/offline-cache';
import { FullScreenPlayer } from '@features/video-player';
import { useCatalog } from '@shared/api/useCatalog';
import { IconSize, Radius, Size, Spacing, useTheme } from '@shared/design-system';
import { FontFamily, FontSize } from '@shared/design-system/tokens';
import { LoadingSpinner } from '@shared/ui/LoadingSpinner';
import { Txt } from '@shared/ui/Txt';

// The player always uses pure black/white regardless of theme — cinema convention.
const PLAYER_BACKGROUND = '#000000';
const OVERLAY_TEXT_COLOR = '#FFFFFF';

interface Props {
  questionId: string;
}

export function PlayerScreen({ questionId }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { resolvePlaybackUri } = useOfflineCache();
  const { findQuestionById } = useCatalog();
  const question = findQuestionById(questionId);

  if (!question) return <LoadingSpinner message={t('player.loading')} />;

  const playbackUri = resolvePlaybackUri(question.videoId, question.videoRemoteUrl);

  function handleClose(): void {
    router.back();
  }

  return (
    <View style={styles.container}>
      <FullScreenPlayer uri={playbackUri} />
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          onPress={handleClose}
          style={[styles.closeButton, { backgroundColor: theme.bgOverlay }]}
          accessibilityRole="button"
          accessibilityLabel={t('player.a11yClose')}
        >
          <X size={IconSize.md} color={OVERLAY_TEXT_COLOR} />
        </Pressable>
        <View style={[styles.questionLabel, { backgroundColor: theme.bgOverlay }]}>
          <Txt style={[styles.questionText, { color: OVERLAY_TEXT_COLOR }]} numberOfLines={2}>
            {question.label}
          </Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PLAYER_BACKGROUND },
  overlay: { ...StyleSheet.absoluteFillObject },
  closeButton: {
    position: 'absolute',
    top: Spacing[12],
    right: Spacing[5],
    width: Size.closeButtonSize,
    height: Size.closeButtonSize,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionLabel: {
    position: 'absolute',
    bottom: Spacing[12],
    left: Spacing[5],
    right: Spacing[5],
    borderRadius: Radius.md,
    padding: Spacing[4],
  },
  questionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
  },
});
