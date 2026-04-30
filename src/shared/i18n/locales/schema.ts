// Structural contract for all translation files.
// Values are string — never literal types — so each locale can use its own wording.
export interface TranslationSchema {
  home: {
    subtitle: string;
    offlineActive: string;
    a11yToggleDark: string;
    a11yToggleLight: string;
    a11yLangToggle: string;
  };
  module: {
    back: string;
    a11yBack: string;
    sectionLabel: string;
    questionCount_one: string;
    questionCount_other: string;
  };
  player: {
    a11yClose: string;
    loading: string;
    redirectCountdown: string;
  };
  offline: {
    cached: string;
  };
  notFound: {
    title: string;
    backHome: string;
  };
  showcase: {
    scanPrompt: string;
    watchVideo: string;
    exitA11y: string;
  };
}
