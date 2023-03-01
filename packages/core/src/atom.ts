import { ref } from "./ref";
import { isStore, store } from "./store";
import { extractStoreValue } from "./types";

export const IS_ATOM = Symbol.for("IS_ATOM");
export const ATOM_VALUE = Symbol.for("ATOM_VALUE");

export type Atom<TValue> = {
  /** @internal */
  [IS_ATOM]: true;
} & (() => extractStoreValue<TValue>) &
  ((v: extractStoreValue<TValue>) => extractStoreValue<TValue>);

export function isAtom(value: any): value is Atom<any> {
  return !!value?.[IS_ATOM];
}

export function atom<TValue>(value: TValue): Atom<extractStoreValue<TValue>> {
  if (isStore(value)) {
    return value as any;
  }

  return store(
    Object.assign(
      function (this: { [ATOM_VALUE]: TValue }) {
        if (arguments.length !== 0) {
          this[ATOM_VALUE] = arguments[0];
        }

        return this[ATOM_VALUE];
      },
      { [IS_ATOM]: ref(true), [ATOM_VALUE]: value }
    )
  ) as unknown as Atom<extractStoreValue<TValue>>;
}
