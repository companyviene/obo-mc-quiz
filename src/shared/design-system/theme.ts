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

  // Module accent bars — three shades for visual differentiation
  moduleShades: readonly [string, string, string];

  // Status (desaturated to stay within B&W palette)
  statusOk: string;
  statusOkBg: string;
  statusNeutral: string;
  statusNeutralBg: string;
  statusWarn: string;
  statusWarnBg: string;
  statusError: string;
  statusErrorBg: string;
}

// ─── Dark theme ───────────────────────────────────────────────────────────────
export const darkTheme: ThemeColors = {
  bgBase: '#080808',
  bgSurface: '#111111',
  bgElevated: '#1C1C1C',
  bgHighlight: '#272727',
  bgOverlay: 'rgba(0, 0, 0, 0.78)',

  textPrimary: '#FFFFFF',
  textSecondary: '#9A9A9A',
  textMuted: '#505050',

  border: '#252525',
  borderSubtle: '#1C1C1C',

  accent: '#FFFFFF',
  accentTint: 'rgba(255, 255, 255, 0.07)',

  moduleShades: ['#FFFFFF', '#888888', '#404040'],

  statusOk: '#D4D4D4',
  statusOkBg: 'rgba(255, 255, 255, 0.10)',
  statusNeutral: '#606060',
  statusNeutralBg: 'rgba(255, 255, 255, 0.04)',
  statusWarn: '#B0B0B0',
  statusWarnBg: 'rgba(255, 255, 255, 0.07)',
  statusError: '#A0A0A0',
  statusErrorBg: 'rgba(255, 255, 255, 0.07)',
};

// ─── Light theme ──────────────────────────────────────────────────────────────
export const lightTheme: ThemeColors = {
  bgBase: '#F8F8F8',
  bgSurface: '#FFFFFF',
  bgElevated: '#EFEFEF',
  bgHighlight: '#E4E4E4',
  bgOverlay: 'rgba(0, 0, 0, 0.42)',

  textPrimary: '#0A0A0A',
  textSecondary: '#4A4A4A',
  textMuted: '#9A9A9A',

  border: '#E0E0E0',
  borderSubtle: '#EBEBEB',

  accent: '#0A0A0A',
  accentTint: 'rgba(0, 0, 0, 0.06)',

  moduleShades: ['#0A0A0A', '#555555', '#A0A0A0'],

  statusOk: '#1A1A1A',
  statusOkBg: 'rgba(0, 0, 0, 0.08)',
  statusNeutral: '#8A8A8A',
  statusNeutralBg: 'rgba(0, 0, 0, 0.04)',
  statusWarn: '#3A3A3A',
  statusWarnBg: 'rgba(0, 0, 0, 0.06)',
  statusError: '#2A2A2A',
  statusErrorBg: 'rgba(0, 0, 0, 0.06)',
};
