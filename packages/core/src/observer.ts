import { DependencyTracker } from "./dependency";

export const observerStack: (Observer | undefined)[] = [];

export class Observer {
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

  ignore = () => {
    if (observerStack.slice(-1)[0] !== this) {
      return;
    }
    observerStack.push(undefined);
  };

  unignore = () => {
    if (observerStack.slice(-1)[0] !== undefined) {
      return;
    }
    observerStack.pop();
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

export function observer(scheduler: () => void = () => {}) {
  return new Observer(scheduler);
}
