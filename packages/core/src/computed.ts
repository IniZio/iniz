import { atom, Atom } from "./atom";
import { effect } from "./effect";

export type Computed<TValue> = Atom<TValue> & {
  /** @internal */
  _compute: () => TValue;
};

export function computed<TValue>(compute: () => TValue): Computed<TValue> {
  const computed = atom<TValue>(compute()) as Computed<TValue>;

  computed._compute = compute;
  effect(() => computed(computed._compute() as any));

  return computed as any;
}
