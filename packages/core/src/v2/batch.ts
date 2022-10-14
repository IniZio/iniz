import { ObserverV2 } from "./observer";

let batchLevel = 0;
export const notifyStack: ObserverV2[] = [];

export function startBatchV2() {
  batchLevel++;
}

export function endBatchV2() {
  if (batchLevel > 1) {
    batchLevel--;
    return;
  }

  for (const observer of notifyStack) {
    observer.notify();
  }
  notifyStack.length = 0;
  batchLevel--;
}

export function batchV2(callback: () => void): void {
  startBatchV2();
  callback();
  endBatchV2();
}
