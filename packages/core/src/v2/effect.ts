import { ObserverV2 } from "./observer";

class EffectV2 {
  #observer = new ObserverV2();

  #fn: () => void = () => {};

  constructor(fn: () => void, { scheduler }: { scheduler?: () => void } = {}) {
    this.#fn = fn;
    this.#observer.scheduler = () => {
      this.#fn();
      scheduler?.();
    };
  }

  exec = () => {
    this.#observer.start();
    this.#fn();
    this.#observer.stop();
  };

  dispose = () => {
    this.#observer.dispose();
  };
}

export function effectV2(
  fn: () => void,
  { scheduler }: { scheduler?: () => void } = {}
) {
  const effect = new EffectV2(fn, { scheduler });
  effect.exec();
  return effect.dispose;
}
