// Color-free shared styles — only layout, spacing, typography shape.
// Color values are applied inline via useTheme() in each component.

import { StyleSheet } from 'react-native';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from './tokens';

// ─── Card ─────────────────────────────────────────────────────────────────────
export const cardStyles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  base: {
    borderRadius: Radius.lg,
    overflow: 'hidden' as const,
    ...Shadow.sm,
  },
});

// ─── Typography ───────────────────────────────────────────────────────────────
// No color — applied by Txt component via useTheme().
export const textStyles = StyleSheet.create({
  brand: {
    fontFamily: FontFamily.extrabold,
    fontSize: FontSize.sm,
    letterSpacing: 5,
    textTransform: 'uppercase' as const,
  },
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * 1.25,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * 1.3,
  },
  h3: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * 1.35,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
  },
  caption: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  label: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
});

// ─── Back button ─────────────────────────────────────────────────────────────
export const backButtonLayout = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  text: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.base,
  },
});
