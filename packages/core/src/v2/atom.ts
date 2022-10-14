import { isStateV2, StateV2, stateV2 } from "./state";
import { extractStateV2Value } from "./types";

export type AtomV2<TValue extends { value: any }> = StateV2<TValue> &
  (() => TValue["value"]) &
  ((v: TValue["value"]) => void);

export function atomV2<TValue>(
  value: TValue
): AtomV2<{ value: extractStateV2Value<TValue> }> {
  if (isStateV2(value)) {
    return value as any;
  }

  return stateV2(Object.assign(() => {}, { value })) as any;
}
