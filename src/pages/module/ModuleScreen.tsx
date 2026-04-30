import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Module } from "@entities/module";
import { useOfflineCache } from "@features/offline-cache";
import { QuestionItem } from "@features/question-selection";
import { useCatalog } from "@shared/api/useCatalog";
import { Breakpoint, IconSize, Spacing, useTheme } from "@shared/design-system";
import { FontSize } from "@shared/design-system/tokens";
import { AccentLine } from "@shared/ui/AccentLine";
import { LoadingSpinner } from "@shared/ui/LoadingSpinner";
import { Txt } from "@shared/ui/Txt";

interface Props {
  moduleId: string;
}

export function ModuleScreen({ moduleId }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { downloadVideo, getVideoCache } = useOfflineCache();
  const { findModuleById } = useCatalog();
  const module: Module | undefined = findModuleById(moduleId);

  useEffect(() => {
    if (!module) return;
    module.questions.forEach((q) => {
      void downloadVideo(q.videoId, q.videoRemoteUrl);
    });
  }, [module, downloadVideo]);

  if (!module) return <LoadingSpinner />;

  const accentColor = theme.moduleShades[module.accentIndex];

  function handleBack(): void {
    router.back();
  }

  async function handleQuestionPress(questionId: string): Promise<void> {
    // On web: request fullscreen synchronously within the user gesture, then
    // AWAIT it before navigating. This guarantees the fullscreen is established
    // before the SPA navigation, so PlayerScreen opens already fullscreen.
    // Using document.documentElement covers Chrome/Edge/Firefox.
    // webkitRequestFullscreen covers desktop Safari.
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const el = document.documentElement as Element & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      const req =
        el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el);
      try {
        await req?.();
      } catch {
        // Fullscreen rejected (e.g. iOS Safari web — only works as PWA).
        // Continue to navigate anyway.
      }
    }
    router.push(`/player/${questionId}`);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
      <View style={styles.centered}>
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={t("module.a11yBack")}
          >
            <ChevronLeft size={IconSize.md} color={theme.accent} />
            <Txt style={[styles.backText, { color: theme.accent }]}>
              {t("module.back")}
            </Txt>
          </Pressable>
          <Txt variant="h2">{module.title}</Txt>
          <Txt variant="body" style={styles.description}>
            {module.description}
          </Txt>
        </View>
        <AccentLine color={accentColor} width={Spacing[10]} />
      </View>
      <FlatList
        data={module.questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const cache = getVideoCache(item.videoId);
          return (
            <QuestionItem
              question={item}
              index={index}
              videoStatus={cache.status}
              downloadProgress={cache.progress}
              onPress={handleQuestionPress}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionLabel label={t("module.sectionLabel")} theme={theme} />
        }
      />
    </View>
  );
}

interface SectionLabelProps {
  label: string;
  theme: ReturnType<typeof useTheme>;
}

function SectionLabel({ label, theme }: SectionLabelProps) {
  return (
    <Txt
      variant="label"
      style={[styles.sectionLabel, { color: theme.textMuted }]}
    >
      {label}
    </Txt>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    width: "100%",
    maxWidth: Breakpoint.content,
    alignSelf: "center",
  },
  header: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[5],
    gap: Spacing[2],
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing[1],
    marginBottom: Spacing[3],
  },
  backText: { fontSize: FontSize.base },
  description: { fontSize: FontSize.sm },
  sectionLabel: { marginBottom: Spacing[4] },
  list: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[8],
    width: "100%",
    maxWidth: Breakpoint.content,
    alignSelf: "center",
  },
});
