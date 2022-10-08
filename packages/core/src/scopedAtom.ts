import { Atom, atom } from "./atom";
import { IS_OBSERVER, Observer } from "./observer";
import { extractValue } from "./types";

export const UNSCOPED_ATOM = Symbol("UNSCOPED_ATOM");
export const SCOPED_OBSERVER = Symbol("SCOPED_OBSERVER");

export type ScopedAtom<TValue> = Atom<extractValue<TValue>> & {
  observer: Observer;
  dispose: () => {};
};

export function scopedAtom<TValue>(
  atomOrInitialValue: TValue,
  { onNotify }: { onNotify?: () => void } = {}
): ScopedAtom<TValue> {
  /*
  Allow wrapping a scopedAtom again with scopedAtom by always extracting unscoped atom
  */
  const maybeScopedAtom = atom(atomOrInitialValue);
  const unscopedAtom: typeof maybeScopedAtom =
    (maybeScopedAtom as any)?.[UNSCOPED_ATOM] ?? maybeScopedAtom;

  const observer = new Observer(() => {}, { onNotify });

  unscopedAtom.mark(observer);

  return new Proxy(unscopedAtom, {
    get: (target, prop) => {
      if (prop === UNSCOPED_ATOM) {
        return unscopedAtom;
      }

      if (prop === "dispose") {
        return () => maybeScopedAtom.unmark(observer);
      }

      // Here the the observer symbol is passed as fake property to let proxy know this getter is from which scoped atom
      if (prop === "value") {
        return (target as any)._proxy[observer[IS_OBSERVER]][prop];
      }

      return target[prop as keyof typeof unscopedAtom];
    },
    set: (target, prop, value) => {
      (target as any)[prop] = value;
      return true;
    },
  }) as any;
}
