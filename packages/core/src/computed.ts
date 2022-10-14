import { atom, Atom } from "./atom";
import { effect } from "./effect";

export type Computed<TValue> = Atom<TValue>;

export function computed<TValue>(compute: () => TValue): Computed<TValue> {
  const computed = atom(compute());
  effect(() => computed(compute() as any));

  return computed;
}
