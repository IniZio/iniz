import { Atom, ATOM_VALUE, isAtom } from "./atom";
import { endBatch, startBatch } from "./batch";
import { COMPUTED_FN } from "./computed";
import { DependencyTracker, OBJECT_LENGTH_KEY } from "./dependency";
import { isRef } from "./ref";
import { extractStoreValue } from "./types";
import { get, isClass } from "./util";

export const IS_STORE = Symbol.for("IS_STORE");

export type Store<TValue> = (TValue extends
  | { [k in keyof TValue]: Store<any> }
  | { [k in keyof TValue]: Atom<any> }
  ? {
      [k in keyof TValue]: extractStoreValue<TValue[k]>;
    }
  : TValue) & {
  /** @internal */
  [IS_STORE]?: true;
};

export function isStore<TValue>(value: TValue): value is Store<any> {
  return !!(value as any)?.[IS_STORE];
}

export function canApplyStateProxy(value: any): boolean {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    (!isClass(value) ||
      (!(value instanceof Map) &&
        !(value instanceof Set) &&
        !(value instanceof WeakMap) &&
        !(value instanceof WeakSet) &&
        !(value instanceof Error) &&
        !(value instanceof Number) &&
        !(value instanceof Date) &&
        !(value instanceof String) &&
        !(value instanceof RegExp) &&
        !(value instanceof ArrayBuffer)))
  );
}

export function store<TValue>(value: TValue): Store<extractStoreValue<TValue>> {
  if (isStore(value)) {
    return value as any;
  }

  // Atom is an object-assigned function, so bypass proxiable check here
  if (!canApplyStateProxy(value) && !isAtom(value)) {
    throw new Error("Provided value is not compatitable with Proxy");
  }

  let store: any;

  function createProxyHandler(
    root: TValue | undefined = undefined,
    parentPath: (string | symbol)[] = [],
    untrack: boolean = false
  ): ProxyHandler<any> {
    return {
      apply(target, _thisArg, argArray) {
        return target.apply(get(store, parentPath), argArray);
      },
      ownKeys(target) {
        const path = parentPath
          .filter((p) => p !== ATOM_VALUE && p !== COMPUTED_FN)
          .concat(Array.isArray(target) ? ["length"] : [OBJECT_LENGTH_KEY]);
        const access = { store, path };

        DependencyTracker.addDependency(access);
        return Reflect.ownKeys(target);
      },
      get(target, prop, receiver) {
        if (prop === IS_STORE) {
          return !root;
        }

        const path = parentPath
          .concat(prop)
          .filter((p) => p !== ATOM_VALUE && p !== COMPUTED_FN);
        const access = { store, path };

        let value = Reflect.get(target, prop, receiver);

        let untrackChild = untrack;

        if (isRef(value)) {
          const { frozen } = value;

          value = value.value;
          untrackChild = true;

          if (frozen) return value;
        }

        if (canApplyStateProxy(value)) {
          return new Proxy(
            value,
            createProxyHandler(root ?? target, path, untrackChild)
          );
        }

        if (isAtom(value)) {
          value = value();
        }

        if (typeof value === "function") {
          value = value.bind(get(store, parentPath));
        }

        DependencyTracker.addDependency(access);

        return value;
      },
      set(target, prop, newValue, receiver) {
        const path = parentPath
          .concat(prop)
          .filter((p) => p !== ATOM_VALUE && p !== COMPUTED_FN);
        const access = { store, path };

        startBatch();
        const oldValue = Reflect.get(target, prop, receiver);
        if (isAtom(oldValue)) {
          oldValue(newValue);
        } else {
          Reflect.set(target, prop, newValue, receiver);
        }

        if (!untrack) {
          DependencyTracker.notifyObservers(access);
        }
        endBatch();

        return true;
      },
    };
  }

  store = new Proxy(value, createProxyHandler());
  return store;
}
