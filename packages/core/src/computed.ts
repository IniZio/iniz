import { atom, Atom } from "./atom";
import { effect } from "./effect";
import { ref } from "./ref";

export const COMPUTED_FN = Symbol.for("COMPUTED_FN");

export type Computed<TValue> = Atom<TValue> & {
  /** @internal */
  [COMPUTED_FN]: () => TValue;
};

export function computed<TValue>(compute: () => TValue): Computed<TValue> {
  const computed = atom<TValue>(compute()) as Computed<TValue>;

  computed[COMPUTED_FN] = ref(compute);
  effect(() => {
    const value = computed[COMPUTED_FN]();

    if (computed() !== value) {
      computed(value as any);
    }
  });

  return computed;
}
