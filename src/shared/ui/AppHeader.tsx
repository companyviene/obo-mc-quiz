import { Moon, Sun, WifiOff } from "lucide-react-native";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Breakpoint,
  IconSize,
  Radius,
  Spacing,
  useTheme,
  useThemeToggle,
  type ThemeColors,
} from "@shared/design-system";
import { FontFamily, FontSize } from "@shared/design-system/tokens";
import { useLocale } from "@shared/i18n";
import { useNetworkStatus } from "@shared/hooks/useNetworkStatus";
import { AccentLine } from "@shared/ui/AccentLine";
import { Txt } from "@shared/ui/Txt";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO_SOURCE = require("@assets/obo-mc-logo-color.png") as number;

const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 60;
const TOGGLE_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const OBO_SITE_URL = "https://obomasterclass.com/";

interface Props {
  /** Show the app subtitle below the logo row. Defaults to true. */
  showSubtitle?: boolean;
  /** Show the offline banner when the device has no connectivity. Defaults to true. */
  showOfflineBanner?: boolean;
  /** Render the AccentLine separator below the header. Defaults to true. */
  showAccentLine?: boolean;
  /** Horizontal padding applied to the header block. Defaults to Spacing[6]. */
  paddingHorizontal?: number;
}

export function AppHeader({
  showSubtitle = true,
  showOfflineBanner = true,
  showAccentLine = true,
  paddingHorizontal = Spacing[6],
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colorScheme, toggleTheme } = useThemeToggle();
  const { locale, toggleLocale } = useLocale();
  const isOnline = useNetworkStatus();

  return (
    <View style={styles.centered}>
      <View style={[styles.header, { paddingHorizontal }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => Linking.openURL(OBO_SITE_URL)}
            accessibilityRole="link"
            accessibilityLabel="OBO Master Class"
          >
            <Image
              source={LOGO_SOURCE}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="OBO Master Class"
            />
          </Pressable>

          <View style={styles.controls}>
            <LocaleToggle
              locale={locale}
              theme={theme}
              onToggle={toggleLocale}
            />
            <ThemeToggle
              colorScheme={colorScheme}
              theme={theme}
              onToggle={toggleTheme}
            />
          </View>
        </View>

        {showSubtitle && (
          <Txt variant="body" style={styles.subtitle}>
            {t("home.subtitle")}
          </Txt>
        )}

        {showOfflineBanner && !isOnline && (
          <OfflineBanner theme={theme} label={t("home.offlineActive")} />
        )}
      </View>

      {showAccentLine && <AccentLine />}
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface LocaleToggleProps {
  locale: "fr" | "en";
  theme: ThemeColors;
  onToggle: () => void;
}

function LocaleToggle({ locale, theme, onToggle }: LocaleToggleProps) {
  const { t } = useTranslation();
  const nextLocaleLabel = locale === "fr" ? "EN" : "FR";

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={TOGGLE_HIT_SLOP}
      style={[
        styles.toggleButton,
        { backgroundColor: theme.bgElevated, borderColor: theme.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t("home.a11yLangToggle")}
    >
      <Txt style={[styles.localeLabel, { color: theme.textSecondary }]}>
        {nextLocaleLabel}
      </Txt>
    </Pressable>
  );
}

interface ThemeToggleProps {
  colorScheme: "dark" | "light";
  theme: ThemeColors;
  onToggle: () => void;
}

function ThemeToggle({ colorScheme, theme, onToggle }: ThemeToggleProps) {
  const { t } = useTranslation();
  const Icon = colorScheme === "dark" ? Sun : Moon;
  const a11yLabel =
    colorScheme === "dark"
      ? t("home.a11yToggleLight")
      : t("home.a11yToggleDark");

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={TOGGLE_HIT_SLOP}
      style={[
        styles.toggleButton,
        { backgroundColor: theme.bgElevated, borderColor: theme.border },
      ]}
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
    <View
      style={[
        styles.offlineBanner,
        {
          backgroundColor: theme.bgHighlight,
          borderLeftColor: theme.textMuted,
        },
      ]}
    >
      <WifiOff size={IconSize.sm} color={theme.textMuted} />
      <Txt style={[styles.offlineText, { color: theme.textMuted }]}>
        {label}
      </Txt>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
    width: "100%",
    maxWidth: Breakpoint.content,
    alignSelf: "center",
  },
  header: {
    paddingTop: Spacing[6],
    paddingBottom: Spacing[5],
    gap: Spacing[3],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  controls: { flexDirection: "row", alignItems: "center", gap: Spacing[2] },
  toggleButton: {
    width: Spacing[10],
    height: Spacing[10],
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  localeLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  subtitle: { fontSize: FontSize.sm },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    borderRadius: Spacing[2],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    alignSelf: "flex-start",
    borderLeftWidth: Spacing[1],
  },
  offlineText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
});
