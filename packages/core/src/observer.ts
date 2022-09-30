import { Atom } from "./atom";

export const IS_OBSERVER = Symbol("IS_OBSERVER");

export const activeObserver: { current: Observer | undefined } = {
  current: undefined,
};

export interface Observer {
  [IS_OBSERVER]: Symbol;

  register(atom: Atom<any>): void;
  notify(): void;
}
