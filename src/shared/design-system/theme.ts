// ─── Theme interface ──────────────────────────────────────────────────────────
// Single source of truth for all color decisions.
// Components NEVER import raw hex values — only ThemeColors keys.

export interface ThemeColors {
  // Backgrounds
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  bgHighlight: string;
  bgOverlay: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Borders
  border: string;
  borderSubtle: string;

  // Primary interactive element
  accent: string;
  accentTint: string;

  // Module accent bars — three semantic colors (hope · science · cosmos)
  moduleShades: readonly [string, string, string];

  // Status
  statusOk: string;
  statusOkBg: string;
  statusNeutral: string;
  statusNeutralBg: string;
  statusWarn: string;
  statusWarnBg: string;
  statusError: string;
  statusErrorBg: string;
}

// ─── Palette tokens ───────────────────────────────────────────────────────────
// Named so the intent is clear when reused across both themes.

// Gold / Amber — warmth, hope, African sun
const GOLD_BRIGHT   = '#F0B030'; // dark-mode accent
const GOLD_RICH     = '#B87814'; // light-mode accent
const GOLD_TINT_D   = 'rgba(240, 176, 48, 0.12)';
const GOLD_TINT_L   = 'rgba(184, 120, 20, 0.10)';

// Teal — science, water, future
const TEAL_BRIGHT   = '#1ABFD4'; // dark-mode
const TEAL_DEEP     = '#0D6E75'; // light-mode

// Indigo / Violet — cosmos, wisdom, depth
const COSMOS_BRIGHT = '#9868E0'; // dark-mode
const COSMOS_DEEP   = '#5C3A9A'; // light-mode

// ─── Dark theme — "Cosmos Africain" ──────────────────────────────────────────
export const darkTheme: ThemeColors = {
  bgBase:       '#0C0800',          // starless night — deep warm black
  bgSurface:    '#160E04',          // slightly lifted warm surface
  bgElevated:   '#221508',          // card / modal surface
  bgHighlight:  '#2E1C0C',          // hover / pressed state
  bgOverlay:    'rgba(255, 200, 100, 0.06)', // subtle warm glow for overlays

  textPrimary:   '#FFF2D8',         // candlelight white
  textSecondary: '#C8943A',         // warm amber secondary
  textMuted:     '#6A4A1E',         // dark warm muted

  border:        '#2A1706',         // warm dark border
  borderSubtle:  '#1A0E04',         // barely visible border

  accent:        GOLD_BRIGHT,       // #F0B030 — hope / CTA
  accentTint:    GOLD_TINT_D,

  // hope · science · cosmos
  moduleShades: [GOLD_BRIGHT, TEAL_BRIGHT, COSMOS_BRIGHT],

  statusOk:        '#50C688',
  statusOkBg:      'rgba(80, 198, 136, 0.12)',
  statusNeutral:   '#A07840',
  statusNeutralBg: 'rgba(160, 120, 64, 0.08)',
  statusWarn:      GOLD_BRIGHT,
  statusWarnBg:    GOLD_TINT_D,
  statusError:     '#E05A3A',
  statusErrorBg:   'rgba(224, 90, 58, 0.12)',
};

// ─── Light theme — "Aube Africaine" ──────────────────────────────────────────
export const lightTheme: ThemeColors = {
  bgBase:       '#FDF6EC',          // warm ivory — sunlit parchment
  bgSurface:    '#FFFFFF',          // pure white card surface
  bgElevated:   '#FFF0D0',          // warm amber tint elevation
  bgHighlight:  '#FFE4B0',          // amber hover / highlight
  bgOverlay:    'rgba(26, 10, 0, 0.48)', // warm dark overlay

  textPrimary:   '#1A0A00',         // very dark warm (rich espresso)
  textSecondary: '#5C3614',         // medium warm brown
  textMuted:     '#A07040',         // muted amber-brown

  border:        '#E8CEAA',         // warm border
  borderSubtle:  '#F0DFC4',         // very subtle warm border

  accent:        GOLD_RICH,         // #B87814 — dark amber CTA
  accentTint:    GOLD_TINT_L,

  // hope · science · cosmos
  moduleShades: [GOLD_RICH, TEAL_DEEP, COSMOS_DEEP],

  statusOk:        '#2D6A4F',
  statusOkBg:      'rgba(45, 106, 79, 0.10)',
  statusNeutral:   '#7A6240',
  statusNeutralBg: 'rgba(122, 98, 64, 0.08)',
  statusWarn:      '#C17A0A',
  statusWarnBg:    'rgba(193, 122, 10, 0.10)',
  statusError:     '#A03020',
  statusErrorBg:   'rgba(160, 48, 32, 0.10)',
};
