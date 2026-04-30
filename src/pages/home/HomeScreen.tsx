import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Module } from "@entities/module";
import { ModuleCard } from "@features/module-selection";
import { useCatalog } from "@shared/api/useCatalog";
import { Breakpoint, Spacing, useTheme } from "@shared/design-system";
import { AppHeader } from "@shared/ui/AppHeader";
import { Txt } from "@shared/ui/Txt";

const GRID_GAP = Spacing[4];
const GRID_PADDING = Spacing[6];
const SHOWCASE_TAP_COUNT = 5;
const TAP_RESET_DELAY_MS = 3_000;
const SECRET_TAP_ZONE_SIZE = 64;

function getColumnCount(screenWidth: number): 1 | 2 | 3 {
  if (screenWidth >= Breakpoint.lg) return 3;
  if (screenWidth >= Breakpoint.sm) return 2;
  return 1;
}

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = getColumnCount(screenWidth);
  const { modules } = useCatalog();

  const secretTapCountRef = useRef(0);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSecretTap(): void {
    secretTapCountRef.current += 1;

    if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    tapResetTimerRef.current = setTimeout(() => {
      secretTapCountRef.current = 0;
    }, TAP_RESET_DELAY_MS);

    if (secretTapCountRef.current >= SHOWCASE_TAP_COUNT) {
      secretTapCountRef.current = 0;
      if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
      router.push("/showcase");
    }
  }

  function handleModulePress(moduleId: string): void {
    router.push(`/modules/${moduleId}`);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
      <AppHeader paddingHorizontal={GRID_PADDING} />
      <FlatList
        key={String(numColumns)}
        data={modules}
        keyExtractor={(item: Module) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: GRID_GAP } : undefined}
        renderItem={({ item }) => (
          <View style={styles.gridCell}>
            <ModuleCard module={item} onPress={handleModulePress} />
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Secret tap zone — invisible, bottom-left corner, 5 taps to enter kiosk mode */}
      <Pressable
        style={styles.secretTapZone}
        onPress={handleSecretTap}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: Spacing[8],
    width: "100%",
    maxWidth: Breakpoint.content,
    alignSelf: "center",
  },
  gridCell: { flex: 1 },
  secretTapZone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: SECRET_TAP_ZONE_SIZE,
    height: SECRET_TAP_ZONE_SIZE,
    opacity: 0,
  },
});
