import { Play } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Question } from '@entities/question';
import { VideoStatus } from '@entities/video';
import { IconSize, Radius, Size, Spacing, useTheme } from '@shared/design-system';
import { FontFamily, FontSize } from '@shared/design-system/tokens';
import { OfflineBadge } from '@shared/ui/OfflineBadge';
import { Txt } from '@shared/ui/Txt';

interface Props {
  question: Question;
  index: number;
  videoStatus: VideoStatus;
  downloadProgress: number;
  onPress: (questionId: string) => void;
}

const SECONDS_PER_MINUTE = 60;
const PAD_LENGTH = 2;
const PAD_CHAR = '0';
const NUMBER_WIDTH = 48;

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${seconds.toString().padStart(PAD_LENGTH, PAD_CHAR)}`;
}

export function QuestionItem({ question, index, videoStatus, downloadProgress, onPress }: Props) {
  const theme = useTheme();
  const number = String(index + 1).padStart(PAD_LENGTH, PAD_CHAR);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        { borderTopColor: theme.border },
        pressed && { opacity: 0.55 },
      ]}
      onPress={() => onPress(question.id)}
      accessibilityRole="button"
      accessibilityLabel={question.label}
    >
      <Txt style={[styles.number, { color: theme.textMuted }]}>{number}</Txt>
      <View style={styles.content}>
        <Txt variant="bodyMedium" numberOfLines={3}>{question.label}</Txt>
        <View style={styles.meta}>
          <Txt style={[styles.duration, { color: theme.textMuted }]}>
            {formatDuration(question.videoDurationSeconds)}
          </Txt>
          <OfflineBadge status={videoStatus} progress={downloadProgress} />
        </View>
      </View>
      <View style={[styles.playButton, { backgroundColor: theme.accent }]}>
        <Play size={IconSize.xs} color={theme.bgBase} fill={theme.bgBase} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[5],
    gap: Spacing[4],
    borderTopWidth: 1,
  },
  number: {
    width: NUMBER_WIDTH,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing[2],
  },
  duration: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  playButton: {
    width: Size.playButtonSize,
    height: Size.playButtonSize,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
