import { Atom, IS_ATOM } from "./atom";
import { Observer, IS_OBSERVER, activeObserver } from "./observer";

export class Effect implements Observer {
  [IS_OBSERVER] = Symbol();

  #atomBySymbol = new Map<Symbol, Atom<any>>();

  #callback: () => void;
  #onNotify?: () => void;
  #tilNextTick?: boolean;

  constructor(
    callback: () => void,
    {
      onNotify,
      tilNextTick,
    }: { onNotify?: () => void; tilNextTick?: boolean } = {}
  ) {
    this.#callback = callback;
    this.#onNotify = onNotify;
    this.#tilNextTick = tilNextTick;
  }

  exec() {
    const canOccupyObserver =
      !activeObserver.current || activeObserver.current instanceof Effect;

    if (canOccupyObserver) {
      activeObserver.current = this;
    }

    this.#callback();

    if (canOccupyObserver) {
      if (this.#tilNextTick) {
        setTimeout(() => {
          activeObserver.current = undefined;
        });
      } else {
        activeObserver.current = undefined;
      }
    }
  }

  dispose = () => {
    this.#atomBySymbol.forEach((reim) => {
      reim.unsubscribe(this);
    });
    this.#atomBySymbol.clear();
  };

  notify() {
    this.exec();
    this.#onNotify?.();
  }

  register(atom: Atom<any>): void {
    this.#atomBySymbol.set(atom[IS_ATOM], atom);
  }
}

export function effect(callback: () => void, onNotify?: () => void) {
  const effect = new Effect(callback, { onNotify });

  effect.exec();
  return effect.dispose;
}
