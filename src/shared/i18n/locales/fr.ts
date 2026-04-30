import type { TranslationSchema } from "./schema";

const fr: TranslationSchema = {
  home: {
    subtitle: "Votre plateforme sur l'héritage politique d'Omar Bongo Ondimba",
    offlineActive: "Mode hors-ligne actif",
    a11yToggleDark: "Passer en mode sombre",
    a11yToggleLight: "Passer en mode clair",
    a11yLangToggle: "Passer en anglais",
  },
  module: {
    back: "Retour",
    a11yBack: "Retour à la liste des modules",
    sectionLabel: "Choisissez une question",
    questionCount_one: "{{count}} question",
    questionCount_other: "{{count}} questions",
  },
  player: {
    a11yClose: "Fermer la vidéo",
    loading: "Chargement de la vidéo…",
    redirectCountdown: "Retour dans {{count}}s…",
  },
  offline: {
    cached: "Hors-ligne",
  },
  notFound: {
    title: "Page introuvable",
    backHome: "Retour à l'accueil",
  },
  showcase: {
    scanPrompt: "Scannez pour regarder la vidéo",
    watchVideo: "Regarder la vidéo",
    exitA11y: "Quitter le mode kiosque",
  },
};

export default fr;
