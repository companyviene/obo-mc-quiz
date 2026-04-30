import type { TranslationSchema } from "./schema";

const en: TranslationSchema = {
  home: {
    subtitle: "Your platform on the political legacy of Omar Bongo Ondimba",
    offlineActive: "Offline mode active",
    a11yToggleDark: "Switch to dark mode",
    a11yToggleLight: "Switch to light mode",
    a11yLangToggle: "Switch to French",
  },
  module: {
    back: "Back",
    a11yBack: "Back to module list",
    sectionLabel: "Choose a question",
    questionCount_one: "{{count}} question",
    questionCount_other: "{{count}} questions",
  },
  player: {
    a11yClose: "Close video",
    loading: "Loading video…",
    redirectCountdown: "Back in {{count}}s…",
  },
  offline: {
    cached: "Offline",
  },
  notFound: {
    title: "Page not found",
    backHome: "Back to home",
  },
  showcase: {
    scanPrompt: "Scan to watch the video",
    watchVideo: "Watch the video",
    exitA11y: "Exit kiosk mode",
  },
};

export default en;
