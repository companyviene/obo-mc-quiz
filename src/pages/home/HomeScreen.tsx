import { useRouter } from 'expo-router';
import { Moon, Sun, WifiOff } from 'lucide-react-native';
import { FlatList, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Module } from '@entities/module';
import { ModuleCard } from '@features/module-selection';
import { useCatalog } from '@shared/api/useCatalog';
import { Breakpoint, IconSize, Radius, Spacing, useTheme, useThemeToggle, type ThemeColors } from '@shared/design-system';
import { FontFamily, FontSize } from '@shared/design-system/tokens';
import { useLocale } from '@shared/i18n';
import { useNetworkStatus } from '@shared/hooks/useNetworkStatus';
import { AccentLine } from '@shared/ui/AccentLine';
import { Txt } from '@shared/ui/Txt';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO_SOURCE = require('@assets/obo-mc-logo-color.png') as number;

const GRID_GAP = Spacing[4];
const GRID_PADDING = Spacing[6];
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 60;
const TOGGLE_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function getColumnCount(screenWidth: number): 1 | 2 | 3 {
  if (screenWidth >= Breakpoint.lg) return 3;
  if (screenWidth >= Breakpoint.sm) return 2;
  return 1;
}

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colorScheme, toggleTheme } = useThemeToggle();
  const { locale, toggleLocale } = useLocale();
  const { t } = useTranslation();
  const isOnline = useNetworkStatus();
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = getColumnCount(screenWidth);
  const { modules } = useCatalog();

  function handleModulePress(moduleId: string): void {
    router.push(`/modules/${moduleId}`);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Image
            source={LOGO_SOURCE}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="OBO Master Class"
          />
          <View style={styles.controls}>
            <LocaleToggle locale={locale} theme={theme} onToggle={toggleLocale} />
            <ThemeToggle colorScheme={colorScheme} theme={theme} onToggle={toggleTheme} />
          </View>
        </View>
        <Txt variant="body" style={styles.subtitle}>{t('home.subtitle')}</Txt>
        {!isOnline && <OfflineBanner theme={theme} label={t('home.offlineActive')} />}
      </View>
      <AccentLine />
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
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface LocaleToggleProps {
  locale: 'fr' | 'en';
  theme: ThemeColors;
  onToggle: () => void;
}

function LocaleToggle({ locale, theme, onToggle }: LocaleToggleProps) {
  const { t } = useTranslation();
  const nextLocaleLabel = locale === 'fr' ? 'EN' : 'FR';

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={TOGGLE_HIT_SLOP}
      style={[styles.toggleButton, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
      accessibilityRole="button"
      accessibilityLabel={t('home.a11yLangToggle')}
    >
      <Txt style={[styles.localeLabel, { color: theme.textSecondary }]}>{nextLocaleLabel}</Txt>
    </Pressable>
  );
}

interface ThemeToggleProps {
  colorScheme: 'dark' | 'light';
  theme: ThemeColors;
  onToggle: () => void;
}

function ThemeToggle({ colorScheme, theme, onToggle }: ThemeToggleProps) {
  const { t } = useTranslation();
  const Icon = colorScheme === 'dark' ? Sun : Moon;
  const a11yLabel = colorScheme === 'dark' ? t('home.a11yToggleLight') : t('home.a11yToggleDark');

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={TOGGLE_HIT_SLOP}
      style={[styles.toggleButton, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      <Icon size={IconSize.md} color={theme.textSecondary} />
    </Pressable>
  );
}

interface OfflineBannerProps {
  theme: ThemeColors;
  label: string;
}

function OfflineBanner({ theme, label }: OfflineBannerProps) {
  return (
    <View style={[styles.offlineBanner, { backgroundColor: theme.bgHighlight, borderLeftColor: theme.textMuted }]}>
      <WifiOff size={IconSize.sm} color={theme.textMuted} />
      <Txt style={[styles.offlineText, { color: theme.textMuted }]}>{label}</Txt>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[5],
    gap: Spacing[3],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  toggleButton: {
    width: Spacing[10],
    height: Spacing[10],
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localeLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  subtitle: { fontSize: FontSize.sm },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderRadius: Spacing[2],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    alignSelf: 'flex-start',
    borderLeftWidth: Spacing[1],
  },
  offlineText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  list: { paddingHorizontal: GRID_PADDING, paddingBottom: Spacing[8] },
  gridCell: { flex: 1 },
});
