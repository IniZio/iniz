import { isState, State, state } from "./state";
import { extractStateValue } from "./types";

export type Atom<TValue> = State<
  TValue extends { value: any } ? TValue : { value: TValue }
> &
  (() => TValue) &
  ((v: TValue) => void);

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
      { value }
    )
  ) as any;
}
