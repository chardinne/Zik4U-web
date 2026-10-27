'use client';

// SITE1-2 — current time for the live labels ("Last redrawn 4 min ago", "live"), refreshed every
// minute. Null on the server and during hydration (no mismatch), then the browser's clock.
import { useSyncExternalStore } from 'react';

let current: number | null = null;
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => { current = Date.now(); subs.forEach((f) => f()); }, 60_000);
  }
  return () => {
    subs.delete(cb);
    if (subs.size === 0 && timer) { clearInterval(timer); timer = null; }
  };
}

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
