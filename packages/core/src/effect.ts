import { observer } from "./observer";

class Effect {
  #observer = observer();

  #action: (() => void) | (() => () => void) = () => {};
  #cleanup: void | (() => void) = () => {};
  #reaction?: () => void = () => {};

  constructor(action: () => void, reaction?: () => void) {
    this.#action = action;
    this.#reaction = reaction;

    this.#observer.scheduler = () => {
      this.exec();
    };
  }

  exec = () => {
    this.#observer.dispose();
    this.#observer.start();
    this.#cleanup = this.#action();
    this.#observer.stop();

    if (!this.#reaction) return;

    this.#observer.ignore();
    this.#reaction?.();
    this.#observer.unignore();
  };

  dispose = () => {
    this.#cleanup?.();
    this.#observer.dispose();
  };
}

export function effect(
  action: (() => void) | (() => () => void),
  reaction?: () => void
) {
  const effect = new Effect(action, reaction);
  effect.exec();
  return effect.dispose;
}
