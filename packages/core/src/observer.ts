import { Atom, IS_ATOM } from "./atom";

export const IS_OBSERVER = Symbol("IS_OBSERVER");

export const activeObserver: { current: Observer | undefined } = {
  current: undefined,
};

export class Observer {
  [IS_OBSERVER] = Symbol();

  #atomBySymbol = new Map<Symbol, Atom<any>>();

  #callback: () => void;
  onNotify?: () => void;

  constructor(
    callback: () => void,
    { onNotify }: { onNotify?: () => void } = {}
  ) {
    this.#callback = callback;
    this.onNotify = onNotify;
  }

  exec = () => {
    activeObserver.current = this;
    this.#callback();
    activeObserver.current = undefined;
  };

  dispose = () => {
    this.#atomBySymbol.forEach((atom) => {
      atom.unsubscribe(this);
    });
    this.#atomBySymbol.clear();
  };

  notify = () => {
    this.exec();
    this.onNotify?.();
  };

  register = (atom: Atom<any>): void => {
    this.#atomBySymbol.set(atom[IS_ATOM], atom);
  };
}
