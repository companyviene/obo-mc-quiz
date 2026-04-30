// Static design tokens — no color values here.
// All colors live in theme.ts and are consumed via useTheme().

import { Platform } from 'react-native';

// ─── Icon sizes ───────────────────────────────────────────────────────────────
// Used with lucide-react-native icons throughout the app.
export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const FontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
} as const;

export const LineHeight = {
  tight: 1.25,
  normal: 1.55,
  relaxed: 1.75,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
// Scale: 1 unit = 4px.
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ─── Named pixel values ───────────────────────────────────────────────────────
// Values that don't fit the spacing scale but must not appear as magic numbers.
export const Size = {
  accentBarWidth: 4,
  playButtonSize: 36,
  closeButtonSize: 38,
  badgePaddingVertical: 3,
  accentLineHeight: 3,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
// Web uses boxShadow (CSS); native uses the shadow* + elevation props.
export const Shadow = {
  sm: Platform.select({
    web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.25)' } as object,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
  })!,
  md: Platform.select({
    web: { boxShadow: '0px 6px 12px rgba(0,0,0,0.35)' } as object,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
  })!,
};

// ─── Grid breakpoints ─────────────────────────────────────────────────────────
export const Breakpoint = {
  sm: 600,
  content: 1200,
  lg: 1024,
} as const;

// ─── Animation durations ──────────────────────────────────────────────────────
export const Duration = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
