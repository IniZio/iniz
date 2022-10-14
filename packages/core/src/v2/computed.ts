import { atomV2, AtomV2 } from "./atom";
import { effectV2 } from "./effect";

export type ComputedV2<TValue> = AtomV2<TValue>;

export function computedV2<TValue>(compute: () => TValue): ComputedV2<TValue> {
  const instance = atomV2(compute());
  effectV2(() => instance(compute() as any));

  return instance;
}
