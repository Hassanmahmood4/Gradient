"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/* ----------------------------------------------------------------------------
   Lesson progress, backed by localStorage via an external store so the sidebar,
   the complete button, and the quiz all stay in sync without a context wrapper.
   This is the seam a database will replace later — swap the read/write here.
---------------------------------------------------------------------------- */

const KEY = "gradient.progress.v1";
const EMPTY: string[] = [];

let snapshot: string[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      snapshot = JSON.parse(raw) as string[];
      emit();
    }
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  hydrate();
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

function write(next: string[]) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

export function useProgress() {
  const arr = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const done = useMemo(() => new Set(arr), [arr]);

  const isDone = useCallback((slug: string) => done.has(slug), [done]);

  const toggle = useCallback((slug: string) => {
    write(
      snapshot.includes(slug)
        ? snapshot.filter((s) => s !== slug)
        : [...snapshot, slug],
    );
  }, []);

  const markComplete = useCallback((slug: string) => {
    if (!snapshot.includes(slug)) write([...snapshot, slug]);
  }, []);

  return { done, isDone, toggle, markComplete, loaded: hydrated };
}
