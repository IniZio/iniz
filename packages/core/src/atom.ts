import { isState, state } from "./state";
import { extractStateValue } from "./types";

export const IS_ATOM = Symbol.for("IS_ATOM");

export type Atom<TValue> = {
  /** @internal */
  [IS_ATOM]: true;
} & (() => extractStateValue<TValue>) &
  ((v: extractStateValue<TValue>) => extractStateValue<TValue>);

export function isAtom(value: any): value is Atom<any> {
  return !!value?.[IS_ATOM];
}

export function atom<TValue>(value: TValue): Atom<TValue> {
  if (isState(value)) {
    return value as any;
  }

  return state(
    Object.assign(
      function (this: { value: TValue }) {
        if (arguments.length !== 0) this.value = arguments[0];
        return this.value;
      },
      { [IS_ATOM]: true as const, value }
    )
  ) as unknown as Atom<TValue>;
}
