import { Play } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Question } from '@entities/question';
import { VideoStatus } from '@entities/video';
import { IconSize, Radius, Shadow, Size, Spacing, cardStyles, useTheme } from '@shared/design-system';
import { FontFamily, FontSize } from '@shared/design-system/tokens';
import { OfflineBadge } from '@shared/ui/OfflineBadge';
import { Txt } from '@shared/ui/Txt';

interface Props {
  question: Question;
  videoStatus: VideoStatus;
  downloadProgress: number;
  onPress: (questionId: string) => void;
}

const SECONDS_PER_MINUTE = 60;
const PAD_LENGTH = 2;
const PAD_CHAR = '0';

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${seconds.toString().padStart(PAD_LENGTH, PAD_CHAR)}`;
}

export function QuestionItem({ question, videoStatus, downloadProgress, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: theme.bgSurface },
        pressed && cardStyles.pressed,
      ]}
      onPress={() => onPress(question.id)}
      accessibilityRole="button"
      accessibilityLabel={question.label}
    >
      <View style={[styles.playColumn, { backgroundColor: theme.bgElevated }]}>
        <View style={[styles.playButton, { backgroundColor: theme.accent }]}>
          <Play size={IconSize.xs} color={theme.bgBase} fill={theme.bgBase} />
        </View>
      </View>
      <View style={styles.content}>
        <Txt variant="bodyMedium" numberOfLines={3}>
          {question.label}
        </Txt>
        <View style={styles.meta}>
          <Txt variant="caption">{formatDuration(question.videoDurationSeconds)}</Txt>
          <OfflineBadge status={videoStatus} progress={downloadProgress} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    marginBottom: Spacing[3],
    overflow: 'hidden',
    ...Shadow.sm,
  },
  playColumn: {
    width: Size.playButtonSize + Spacing[5],
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: Size.playButtonSize,
    height: Size.playButtonSize,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing[4],
    gap: Spacing[2],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
});
