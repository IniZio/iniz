import { atom, Atom } from "./atom";
import { effect } from "./effect";
import { ref } from "./ref";

export type Computed<TValue> = Atom<TValue> & {
  /** @internal */
  _compute: () => TValue;
};

export function computed<TValue>(compute: () => TValue): Computed<TValue> {
  const computed = atom<TValue>(compute()) as Computed<TValue>;

  computed._compute = ref(compute);
  effect(() => {
    const value = computed._compute();

    if (computed() !== value) {
      computed(value as any);
    }
  });

  return computed;
}
