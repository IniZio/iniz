import { Atom, atom } from "./atom";
import { Effect } from "./effect";
import { extractValue } from "./types";

const UNSCOPED_ATOM = Symbol("UNSCOPED_ATOM");

export type DisposableAtom<TValue> = Atom<extractValue<TValue>> & {
  dispose: () => void;
};

export function scopedAtom<TValue>(
  atomOrInitialValue: TValue,
  {
    tilNextTick,
    onNotify,
  }: { onNotify?: () => void; tilNextTick?: boolean } = {}
): DisposableAtom<TValue> {
  /*
  Allow wrapping a scopedAtom again with scopedAtom by always extracting unscoped atom
  */
  const maybeScopedAtom = atom(atomOrInitialValue);
  const unscopedAtom: typeof maybeScopedAtom =
    (maybeScopedAtom as any)?.[UNSCOPED_ATOM] ?? maybeScopedAtom;

  let value: any;
  let eff: Effect;

  return new Proxy(unscopedAtom, {
    get: (target, prop) => {
      if (prop === UNSCOPED_ATOM) {
        return unscopedAtom;
      }

      if (prop === "dispose") {
        return eff?.dispose ?? (() => {});
      }

      if (prop === "value") {
        if (!eff) {
          eff = new Effect(
            () => {
              value = (target as any)[prop];
            },
            { onNotify, tilNextTick }
          );
        }
        // TODO: On hot-reload, the original onNotify will be invalid.
        // Add method to update onNotify properly
        eff.onNotify = onNotify;
        eff.exec();
      } else {
        value = (target as any)[prop];
      }

      return value;
    },
    set: (target, prop, value) => {
      (target as any)[prop] = value;
      return true;
    },
  }) as any;
}
