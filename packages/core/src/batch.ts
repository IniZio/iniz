import type { Observer } from "./observer";

let batchLevel = 0;
export const notifyStack: Observer[] = [];

export function startBatch() {
  batchLevel++;
}

export function endBatch() {
  if (batchLevel > 1) {
    batchLevel--;
    return;
  }

  // TODO: Error if notifyStack keeps growing?
  for (const observer of notifyStack) {
    observer.notify();
  }
  notifyStack.length = 0;
  batchLevel--;
}

export function batch(callback: () => void): void {
  startBatch();
  callback();
  endBatch();
}
