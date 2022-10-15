import { atom, Atom } from "./atom";
import { effect } from "./effect";

export type Computed<TValue> = Atom<TValue>;

export function computed<TValue>(compute: () => TValue): Computed<TValue> {
  const computed = atom<TValue>(compute());
  effect(() => {
    computed.value = compute();
  });

  return computed;
}
