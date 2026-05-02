# OBO MC Quiz

Mini video capsule quiz app for [OBO Master Class](https://obomasterclass.com/).  
Live at **[faq.obomasterclass.com](https://faq.obomasterclass.com/)**.

## What it does

Users select a learning module, pick a question, and watch a short video answer in full screen. The app works offline — videos are cached via Service Worker after the first play. A kiosk/showcase mode displays QR codes that visitors can scan to watch a specific capsule directly.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81.5 |
| Routing | Expo Router v6 (file-based) |
| Web export | `expo export --platform web` → static PWA |
| Language | TypeScript 5.9 (strict) |
| Architecture | Feature-Sliced Design (FSD) |
| State | Zustand |
| i18n | i18next + react-i18next (FR default, EN) |
| Video | expo-video |
| Offline cache (web) | Service Worker + Cache API |
| Offline cache (native) | expo-file-system/legacy |
| QR codes | react-native-qrcode-svg |
| Icons | lucide-react-native |
| Font | Poppins (Google Fonts) |
| Deployment | Vercel (auto-deploy on push to `main`) |

## Project structure

```
quiz/
├── app/                        # Expo Router pages
│   ├── _layout.tsx
│   ├── index.tsx               # Home
│   ├── showcase.tsx            # Kiosk / QR display mode
│   ├── modules/[id].tsx        # Module screen
│   └── player/[questionId].tsx # Video player (supports ?kiosk=1)
├── src/
│   ├── entities/               # Domain types (Module, Question, Video)
│   ├── features/
│   │   ├── module-selection/   # ModuleCard
│   │   ├── offline-cache/      # useOfflineCache, webVideoCache, cacheStore
│   │   ├── question-selection/ # QuestionItem
│   │   ├── showcase/           # QuestionQrCard, useQuestionCarousel
│   │   └── video-player/       # FullScreenPlayer
│   ├── pages/
│   │   ├── home/               # HomeScreen
│   │   ├── module/             # ModuleScreen
│   │   ├── player/             # PlayerScreen
│   │   └── showcase/           # ShowcaseScreen
│   └── shared/
│       ├── api/                # catalogRepository, useCatalog
│       ├── config/             # enums (StorageKey, …)
│       ├── design-system/      # tokens, theme, ThemeContext
│       ├── hooks/              # useNetworkStatus
│       ├── i18n/               # fr/en locales, schema
│       ├── lib/                # storage (AsyncStorage wrapper)
│       ├── pwa/                # registerServiceWorker
│       └── ui/                 # AccentLine, AppHeader, Txt, OfflineBadge, …
├── data/
│   └── catalog.json            # Module & question catalog (multilingual)
├── assets/                     # Logo, fonts, icons
└── public/
    ├── sw.js                   # Service Worker (video cache + range requests)
    └── .htaccess               # Apache SPA fallback (FTP deploy)
```

## Getting started

```bash
cd quiz
npm install
npm start          # Expo dev server
npm run web        # Web only
npm run build:web  # Static export → dist/
```

## Catalog format

Modules and questions live in `data/catalog.json`:

```json
{
  "modules": [
    {
      "id": "mod-example",
      "accentIndex": 0,
      "i18n": {
        "fr": { "title": "Titre FR", "description": "Description FR" },
        "en": { "title": "EN title", "description": "EN description" }
      },
      "questions": [
        {
          "id": "q-example-01",
          "i18n": {
            "fr": { "label": "Question FR ?" },
            "en": { "label": "EN question?" }
          },
          "video": {
            "id": "v-example-01",
            "remoteUrl": "https://res.cloudinary.com/…/video.mp4",
            "durationSeconds": 120
          }
        }
      ]
    }
  ]
}
```

## Offline & PWA

- **Web**: The Service Worker (`public/sw.js`) intercepts `.mp4` requests and serves from Cache Storage when available. Videos are explicitly downloaded via `useOfflineCache` and cached by their remote URL, enabling full offline playback with range-request support.
- **Native (iOS/Android)**: Videos are downloaded to the device cache via `expo-file-system/legacy`.

## Kiosk / Showcase mode

Navigate to `/showcase` to display a QR code grid. Each card links to `/player/{questionId}?kiosk=1`. When a visitor scans the QR code, a full-screen tap overlay appears immediately (browser restriction — autoplay requires a user gesture on a fresh tab). One tap starts playback with sound in full screen.

## Deployment

Push to `main` → Vercel builds and deploys automatically to `faq.obomasterclass.com`.
