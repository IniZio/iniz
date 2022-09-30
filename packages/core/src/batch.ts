import { Observer } from "./observer";

let batchLevel = 0;

export const batchedObservers = new Set<Observer>();

export function startBatch() {
  batchLevel++;
}

export function endBatch() {
  if (batchLevel > 1) {
    batchLevel--;
    return;
  }

  batchedObservers.forEach((o) => o.notify());
  batchedObservers.clear();
  batchLevel--;
}

export function batch(callback: () => void): void {
  startBatch();
  callback();
  endBatch();
}
