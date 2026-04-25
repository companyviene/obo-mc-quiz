import type { Question } from '../question/types';

export type AccentIndex = 0 | 1 | 2;

export interface Module {
  id: string;
  title: string;
  description: string;
  accentIndex: AccentIndex;
  questions: Question[];
}
