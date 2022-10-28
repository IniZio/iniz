import { observer } from "./observer";

class Effect {
  #observer = observer();

  #fn: () => void = () => {};

  constructor(fn: () => void, { scheduler }: { scheduler?: () => void } = {}) {
    this.#fn = fn;
    this.#observer.scheduler = () => {
      this.exec();
      scheduler?.();
    };
  }

  exec = () => {
    this.#observer.dispose();
    this.#observer.start();
    this.#fn();
    this.#observer.stop();
  };

  dispose = () => {
    this.#observer.dispose();
  };
}

export function effect(
  fn: () => void,
  { scheduler }: { scheduler?: () => void } = {}
) {
  const effect = new Effect(fn, { scheduler });
  effect.exec();
  return effect.dispose;
}
