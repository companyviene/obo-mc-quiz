import type { AccentIndex, Module } from '@entities/module/types';
import type { Question } from '@entities/question/types';
import type { SupportedLocale } from '@shared/i18n';

// ─── Raw JSON shapes ──────────────────────────────────────────────────────────

interface CatalogI18nContent {
  title: string;
  description: string;
}

interface CatalogQuestionI18n {
  label: string;
}

interface CatalogVideoJson {
  id: string;
  remoteUrl: string;
  durationSeconds: number;
}

interface CatalogQuestionJson {
  id: string;
  i18n: Record<SupportedLocale, CatalogQuestionI18n>;
  video: CatalogVideoJson;
}

interface CatalogModuleJson {
  id: string;
  accentIndex: AccentIndex;
  i18n: Record<SupportedLocale, CatalogI18nContent>;
  questions: CatalogQuestionJson[];
}

interface CatalogJson {
  modules: CatalogModuleJson[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapQuestion(raw: CatalogQuestionJson, moduleId: string, locale: SupportedLocale): Question {
  return {
    id: raw.id,
    moduleId,
    label: raw.i18n[locale].label,
    videoId: raw.video.id,
    videoRemoteUrl: raw.video.remoteUrl,
    videoDurationSeconds: raw.video.durationSeconds,
  };
}

function mapModule(raw: CatalogModuleJson, locale: SupportedLocale): Module {
  return {
    id: raw.id,
    accentIndex: raw.accentIndex,
    title: raw.i18n[locale].title,
    description: raw.i18n[locale].description,
    questions: raw.questions.map((q) => mapQuestion(q, raw.id, locale)),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function loadCatalog(locale: SupportedLocale): Module[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require('@data/catalog.json') as CatalogJson;
  return data.modules.map((m) => mapModule(m, locale));
}

export function findModule(modules: Module[], id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findQuestion(modules: Module[], questionId: string): Question | undefined {
  for (const module of modules) {
    const found = module.questions.find((q) => q.id === questionId);
    if (found) return found;
  }
  return undefined;
}
