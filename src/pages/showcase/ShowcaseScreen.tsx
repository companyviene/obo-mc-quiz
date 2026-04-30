import { useRouter } from "expo-router";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  QuestionQrCard,
  useQuestionGrid,
  VISIBLE_CARD_COUNT,
  type CardSlot,
} from "@features/showcase";
import {
  Breakpoint,
  FontFamily,
  FontSize,
  Spacing,
} from "@shared/design-system/tokens";
import { useTheme } from "@shared/design-system";
import { AppHeader } from "@shared/ui/AppHeader";
import { LoadingSpinner } from "@shared/ui/LoadingSpinner";
import { Txt } from "@shared/ui/Txt";

const SHOWCASE_BACKGROUND = "#000000";
const EXIT_HIT_SLOP = { top: 20, bottom: 20, left: 20, right: 20 };

function getColumnCount(screenWidth: number): 1 | 2 | 3 {
  if (screenWidth >= Breakpoint.lg) return 3;
  if (screenWidth >= Breakpoint.sm) return 2;
  return 1;
}

function buildVideoUrl(questionId: string): string {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return `/player/${questionId}`;
  }
  return `${window.location.origin}/player/${questionId}`;
}

export function ShowcaseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = getColumnCount(screenWidth);
  const slots = useQuestionGrid(VISIBLE_CARD_COUNT);

  function handleExit(): void {
    router.replace("/");
  }

  if (slots.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
      <AppHeader showOfflineBanner={false} />
      <FlatList<CardSlot>
        key={String(numColumns)}
        data={slots}
        keyExtractor={(_, index) => String(index)}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.cardCell}>
            <QuestionQrCard
              question={item.question}
              videoUrl={buildVideoUrl(item.question.id)}
              progressRatio={item.progressRatio}
              compact
            />
          </View>
        )}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Exit kiosk mode — bottom-right, discreet */}
      <Pressable
        style={styles.exitButton}
        onPress={handleExit}
        hitSlop={EXIT_HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={t("showcase.exitA11y")}
      >
        <Txt style={styles.exitLabel}>{t("showcase.exitA11y")}</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHOWCASE_BACKGROUND,
  },
  flatList: {
    width: "100%",
    maxWidth: Breakpoint.content,
    alignSelf: "center",
  },
  grid: {
    padding: Spacing[4],
    paddingBottom: Spacing[16],
  },
  row: {
    gap: Spacing[4],
  },
  cardCell: {
    flex: 1,
    marginBottom: Spacing[4],
  },
  exitButton: {
    position: "absolute",
    bottom: Spacing[6],
    right: Spacing[6],
    opacity: 0.35,
  },
  exitLabel: {
    color: "#FFFFFF",
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
});
