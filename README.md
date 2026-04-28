# OBO MC Quiz

Mini video capsule quiz app for [OBO Master Class](https://obomasterclass.com/).  
Live at **[faq.obomasterclass.com](https://faq.obomasterclass.com/)**.

## What it does

Users select a learning module, pick a question, and watch a short video answer in full screen. The app works offline — videos are cached on device after the first view.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81.5 |
| Routing | Expo Router v6 (file-based) |
| Web export | `expo export --platform web` → static PWA |
| Language | TypeScript 5.9 (strict) |
| Architecture | Feature-Sliced Design (FSD) |
| State | Zustand |
| Data fetching | TanStack Query v5 |
| i18n | i18next + react-i18next (FR default, EN) |
| Video | expo-video |
| Offline cache | expo-file-system/legacy |
| Icons | lucide-react-native |
| Font | Poppins (Google Fonts) |
| Deployment | Vercel (auto-deploy on push to `main`) |

## Project structure

```
quiz/
├── app/                  # Expo Router pages
├── src/
│   ├── entities/         # Domain types (Module, Question)
│   ├── features/         # offline-cache, module-selection, video-player
│   ├── pages/            # HomeScreen, ModuleScreen, PlayerScreen
│   └── shared/           # design-system, i18n, api, hooks, ui
├── data/
│   └── catalog.json      # Module & question catalog (multilingual)
├── assets/               # Logo, fonts, icons
└── public/               # .htaccess (Apache fallback)
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
          "video": { "uri": "https://..." }
        }
      ]
    }
  ]
}
```

## Deployment

Push to `main` → Vercel builds and deploys automatically to `faq.obomasterclass.com`.
