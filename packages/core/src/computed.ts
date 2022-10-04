import { Atom, IS_ATOM } from "./atom";
import { activeObserver, IS_OBSERVER, Observer } from "./observer";

export class Computed<TValue> extends Atom<TValue> implements Observer {
  [IS_OBSERVER] = Symbol();

  #atomBySymbol = new Map<Symbol, Atom<any>>();

  #callback: () => TValue;
  #onNotify?: () => void;
  #tilNextTick?: boolean;

  constructor(
    callback: () => TValue,
    {
      tilNextTick,
      onNotify,
    }: { onNotify?: () => void; tilNextTick?: boolean } = {}
  ) {
    super(callback());

    this.#callback = callback;
    this.#onNotify = onNotify;
    this.#tilNextTick = tilNextTick;

    this.exec();
  }

  exec() {
    activeObserver.current = this;

    this.value = this.#callback();

    if (this.#tilNextTick) {
      setTimeout(() => {
        activeObserver.current = undefined;
      });
    } else {
      activeObserver.current = undefined;
    }
  }

  dispose = () => {
    this.#atomBySymbol.forEach((reim) => {
      reim.unsubscribe(this);
    });
    this.#atomBySymbol.clear();
  };

  notify = () => {
    this.exec();
    this.#onNotify?.();
  };

  register = (atom: Atom<any>): void => {
    this.#atomBySymbol.set(atom[IS_ATOM], atom);
  };
}

export function computed<TValue>(
  callback: () => TValue,
  { onNotify }: { onNotify?: () => void } = {}
) {
  return new Computed(callback, { onNotify });
}
