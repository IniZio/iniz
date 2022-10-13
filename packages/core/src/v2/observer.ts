import { DependencyTracker } from "./dependency";

export const observerStack: ObserverV2[] = [];

export class ObserverV2 {
  scheduler?: () => void;

  constructor(scheduler: () => void = () => {}) {
    this.scheduler = scheduler;
  }

  start = () => {
    if (observerStack.slice(-1)[0] === this) {
      return;
    }
    observerStack.push(this);
  };

  stop = () => {
    if (observerStack.slice(-1)[0] !== this) {
      return;
    }
    observerStack.pop();
  };

  notify = () => {
    this.scheduler?.();
  };

  dispose = () => {
    DependencyTracker.clearDependencies(this);
  };
}
