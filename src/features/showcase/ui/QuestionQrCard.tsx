import QRCode from "react-native-qrcode-svg";
import { StyleSheet, View, type TextStyle } from "react-native";
import { useTranslation } from "react-i18next";
import type { Question } from "@entities/question";
import { useTheme } from "@shared/design-system";
import {
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@shared/design-system/tokens";
import { Txt } from "@shared/ui/Txt";

const QR_CODE_SIZE_NORMAL = 180;
const QR_CODE_SIZE_COMPACT = 130;
const PROGRESS_BAR_HEIGHT = 3;

interface Props {
  question: Question;
  videoUrl: string;
  progressRatio: number;
  compact?: boolean;
}

export function QuestionQrCard({
  question,
  videoUrl,
  progressRatio,
  compact = false,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const qrSize = compact ? QR_CODE_SIZE_COMPACT : QR_CODE_SIZE_NORMAL;
  // QR code always black-on-white for maximum scanner compatibility
  const qrBg = "#FFFFFF";
  const qrFg = "#000000";

  return (
    <View
      style={[
        styles.card,
        compact ? styles.cardCompact : null,
        { backgroundColor: theme.bgElevated },
      ]}
    >
      {/* Progress bar — bottom edge of card, fills over CARD_DISPLAY_DURATION_MS */}
      <View
        style={[styles.progressTrack, { backgroundColor: theme.borderSubtle }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.round(progressRatio * 100)}%`,
              backgroundColor: theme.accent,
            },
          ]}
        />
      </View>

      <Txt
        style={
          [
            styles.questionLabel,
            compact ? styles.questionLabelCompact : undefined,
            { color: theme.textPrimary },
          ] as TextStyle[]
        }
        numberOfLines={3}
      >
        {question.label}
      </Txt>

      <View style={[styles.qrWrapper, { backgroundColor: qrBg }]}>
        <QRCode
          value={videoUrl}
          size={qrSize}
          backgroundColor={qrBg}
          color={qrFg}
        />
      </View>

      <Txt
        style={
          [
            styles.scanPrompt,
            compact ? styles.scanPromptCompact : undefined,
            { color: theme.textSecondary },
          ] as TextStyle[]
        }
      >
        {t("showcase.scanPrompt")}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: Radius.xl,
    paddingTop: Spacing[8],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
    gap: Spacing[6],
    overflow: "hidden",
  },
  cardCompact: {
    paddingTop: Spacing[5],
    paddingHorizontal: Spacing[4],
    gap: Spacing[4],
    borderRadius: Radius.lg,
  },
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: PROGRESS_BAR_HEIGHT,
  },
  progressFill: {
    height: PROGRESS_BAR_HEIGHT,
  },
  questionLabel: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xl,
    textAlign: "center",
    lineHeight: FontSize.xl * 1.4,
  },
  questionLabelCompact: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.4,
  },
  qrWrapper: {
    padding: Spacing[3],
    borderRadius: Radius.md,
  },
  scanPrompt: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  scanPromptCompact: {
    fontSize: FontSize.xs,
  },
});
