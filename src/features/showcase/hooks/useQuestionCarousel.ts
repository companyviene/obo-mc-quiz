import { useEffect, useRef, useState } from "react";
import type { Question } from "@entities/question";
import { useCatalog } from "@shared/api/useCatalog";

export const VISIBLE_CARD_COUNT = 6;
const CARD_DISPLAY_DURATION_MS = 20_000;

export interface CardSlot {
  question: Question;
  progressRatio: number;
  /** Increments each time the question changes — use as React key to animate transitions. */
  slotKey: number;
}

function shuffleArray<T>(source: T[]): T[] {
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Manages `visibleCount` independent question slots that rotate continuously.
 *
 * - Slots are staggered so a new card appears every DURATION / visibleCount seconds.
 * - No duplicate question is ever visible at the same time across all slots.
 * - The question pool loops indefinitely (reshuffled on each full pass).
 * - A single rAF loop drives all progress bars.
 */
export function useQuestionGrid(visibleCount = VISIBLE_CARD_COUNT): CardSlot[] {
  const { modules } = useCatalog();
  const [slots, setSlots] = useState<CardSlot[]>([]);

  const poolRef = useRef<Question[]>([]);
  const poolCursorRef = useRef(0);
  const slotStartTimesRef = useRef<number[]>([]);
  const slotTimersRef = useRef<(ReturnType<typeof setTimeout> | null)[]>([]);
  const slotKeyCounterRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  // Mirror of React state — accessed by async timer callbacks without stale closure risk.
  const slotsRef = useRef<CardSlot[]>([]);

  useEffect(() => {
    const allQuestions = modules.flatMap((m) => m.questions);
    if (allQuestions.length === 0) return;

    const effectiveCount = Math.min(visibleCount, allQuestions.length);
    const staggerIntervalMs = CARD_DISPLAY_DURATION_MS / effectiveCount;

    poolRef.current = shuffleArray(allQuestions);
    poolCursorRef.current = 0;
    slotKeyCounterRef.current = 0;

    // Returns the next non-excluded question from the pool.
    // Reshuffles the pool whenever all questions have been consumed.
    function dequeueQuestion(excludedIds: Set<string>): Question {
      const pool = poolRef.current;
      const maxAttempts = pool.length * 2;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (poolCursorRef.current >= pool.length) {
          poolRef.current = shuffleArray([...pool]);
          poolCursorRef.current = 0;
        }
        const candidate = poolRef.current[poolCursorRef.current++];
        if (!excludedIds.has(candidate.id)) return candidate;
      }
      // Fallback: visible count >= total questions — any question is acceptable.
      return poolRef.current[0];
    }

    // Replaces the question in one slot and schedules its next rotation.
    function advanceSlot(slotIndex: number): void {
      const current = slotsRef.current;
      const excludedIds = new Set<string>(
        current.flatMap((s, i) => (i !== slotIndex ? [s.question.id] : [])),
      );
      const question = dequeueQuestion(excludedIds);
      const key = ++slotKeyCounterRef.current;
      slotStartTimesRef.current[slotIndex] = performance.now();

      const updated = current.map((s, i) =>
        i === slotIndex ? { question, progressRatio: 0, slotKey: key } : s,
      );
      slotsRef.current = updated;
      setSlots(updated);

      slotTimersRef.current[slotIndex] = setTimeout(
        () => advanceSlot(slotIndex),
        CARD_DISPLAY_DURATION_MS,
      );
    }

    // Build initial slots — unique questions, staggered start times.
    const usedIds = new Set<string>();
    const now = performance.now();
    const initialSlots: CardSlot[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      const question = dequeueQuestion(usedIds);
      usedIds.add(question.id);
      // Back-date start time so slot i appears i * staggerInterval seconds into its timer.
      slotStartTimesRef.current[i] = now - i * staggerIntervalMs;
      initialSlots.push({
        question,
        progressRatio: (i * staggerIntervalMs) / CARD_DISPLAY_DURATION_MS,
        slotKey: ++slotKeyCounterRef.current,
      });
    }

    slotsRef.current = initialSlots;
    setSlots(initialSlots);

    // Staggered first-rotation timers: slot 0 fires after DURATION, slot i after DURATION - i*STAGGER.
    slotTimersRef.current = initialSlots.map((_, i) => {
      const delay = CARD_DISPLAY_DURATION_MS - i * staggerIntervalMs;
      return setTimeout(() => advanceSlot(i), delay);
    });

    // Single rAF loop updates all progress ratios every frame.
    function tick(): void {
      const tickNow = performance.now();
      const starts = slotStartTimesRef.current;
      setSlots((prev) => {
        let changed = false;
        const next = prev.map((slot, i) => {
          const ratio = Math.min(
            (tickNow - (starts[i] ?? tickNow)) / CARD_DISPLAY_DURATION_MS,
            1,
          );
          if (Math.abs(ratio - slot.progressRatio) < 0.001) return slot;
          changed = true;
          return { ...slot, progressRatio: ratio };
        });
        return changed ? next : prev;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      slotTimersRef.current.forEach((t) => {
        if (t !== null) clearTimeout(t);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules, visibleCount]);

  return slots;
}
