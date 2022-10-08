import { Observer } from "./observer";

export const batchLevel = { current: 0 };
export const batchedObservers = new Set<Observer>();

export function startBatch() {
  batchLevel.current++;
}

export function endBatch() {
  if (batchLevel.current > 1) {
    batchLevel.current--;
    return;
  }

  batchedObservers.forEach((o) => o.notify());
  batchedObservers.clear();
  batchLevel.current--;
}

export function batch(callback: () => void): void {
  startBatch();
  callback();
  endBatch();
}
