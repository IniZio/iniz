import { Atom, atom, CURRENT_PATH } from "./atom";
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
  const rootAtom =
    (atomOrInitialValue as any)?.[UNSCOPED_ATOM] ?? atomOrInitialValue;

  if (rootAtom !== atomOrInitialValue) {
    const rootScopedAtom = scopedAtom(rootAtom, { onNotify });

    return new Proxy(rootScopedAtom, {
      get: (target, prop) => {
        if (prop === UNSCOPED_ATOM) {
          return rootAtom;
        }

        if (prop === "dispose") {
          return () => rootAtom.unmark(observer);
        }

        if (prop === "value") {
          const currentPath = (atomOrInitialValue as any)[CURRENT_PATH];
          let value = rootScopedAtom;

          if (currentPath[0] !== "value") {
            value = value.value;
          }

          for (const path of currentPath) {
            value = (value as any)[path];
          }

          return value;
        }

        return (target as any)[prop];
      },
    });
  }

  const unscopedAtom = atom(atomOrInitialValue);
  const observer = new Observer(() => {}, { onNotify });

  unscopedAtom.mark(observer);

  return new Proxy(unscopedAtom, {
    get: (target, prop) => {
      if (prop === UNSCOPED_ATOM) {
        return unscopedAtom;
      }

      if (prop === "dispose") {
        return () => unscopedAtom.unmark(observer);
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
