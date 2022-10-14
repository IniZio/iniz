import { isState, State, state } from "./state";
import { extractStateValue } from "./types";

export type Atom<TValue> = State<{ value: TValue }> &
  (() => TValue) &
  ((v: TValue) => void);

export function atom<TValue>(value: TValue): Atom<extractStateValue<TValue>> {
  if (isState(value)) {
    return value as any;
  }

  return state(Object.assign(() => {}, { value })) as any;
}
