import { isState, State, state } from "./state";
import { extractStateValue } from "./types";

export const IS_ATOM = Symbol.for("IS_ATOM");

export type Atom<TValue> = { value: State<TValue> } & {
  /** @internal */
  [IS_ATOM]: true;
} & (() => State<TValue>) &
  ((v: extractStateValue<TValue>) => void);

export function isAtom(value: any): value is Atom<any> {
  return !!value?.[IS_ATOM];
}

export function atom<TValue>(value: TValue): Atom<extractStateValue<TValue>> {
  if (isState(value)) {
    return value as any;
  }

  return state(
    Object.assign(
      function (this: { value: TValue }) {
        if (arguments.length === 0) return this.value;
        this.value = arguments[0];
      },
      { [IS_ATOM]: true, value }
    )
  ) as any;
}
