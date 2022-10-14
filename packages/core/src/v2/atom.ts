import { isStateV2, StateV2, stateV2 } from "./state";
import { extractStateV2Value } from "./types";

export type AtomV2<TValue> = StateV2<{ value: TValue }> &
  (() => TValue) &
  ((v: TValue) => void);

export function atomV2<TValue>(
  value: TValue
): AtomV2<extractStateV2Value<TValue>> {
  if (isStateV2(value)) {
    return value as any;
  }

  return stateV2(Object.assign(() => {}, { value })) as any;
}
