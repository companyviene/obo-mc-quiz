import { useMemo } from 'react';
import type { Module } from '@entities/module';
import type { Question } from '@entities/question';
import { useLocale } from '@shared/i18n';
import { findModule, findQuestion, loadCatalog } from './catalogRepository';

interface CatalogAccessors {
  modules: Module[];
  findModuleById: (id: string) => Module | undefined;
  findQuestionById: (questionId: string) => Question | undefined;
}

// Reloads the catalog whenever the active locale changes.
// loadCatalog() is synchronous (require of static JSON) so useMemo is safe.
export function useCatalog(): CatalogAccessors {
  const { locale } = useLocale();

  const modules = useMemo(() => loadCatalog(locale), [locale]);

  function findModuleById(id: string): Module | undefined {
    return findModule(modules, id);
  }

  function findQuestionById(questionId: string): Question | undefined {
    return findQuestion(modules, questionId);
  }

  return { modules, findModuleById, findQuestionById };
}
